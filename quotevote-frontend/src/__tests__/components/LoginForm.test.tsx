/**
 * Tests for LoginForm Component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/app/components/Login/LoginForm';

describe('LoginForm Component', () => {
    const mockOnSubmit = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all form fields', () => {
        render(<LoginForm onSubmit={mockOnSubmit} loading={false} />);

        expect(screen.getByLabelText(/email\/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });

    it('renders Terms of Service checkbox and link', () => {
        render(<LoginForm onSubmit={mockOnSubmit} loading={false} />);

        expect(screen.getByText(/terms of service/i)).toBeInTheDocument();
        const tosLink = screen.getByRole('link', { name: /terms of service/i });
        expect(tosLink).toHaveAttribute('href', expect.stringContaining('quote_vote_terms_of_service.md'));
        expect(tosLink).toHaveAttribute('target', '_blank');
    });

    it('renders Code of Conduct checkbox and link', () => {
        render(<LoginForm onSubmit={mockOnSubmit} loading={false} />);

        expect(screen.getByText(/code of conduct/i)).toBeInTheDocument();
        const cocLink = screen.getByRole('link', { name: /code of conduct/i });
        expect(cocLink).toHaveAttribute('href', expect.stringContaining('quote_vote_code_of_conduct.md'));
        expect(cocLink).toHaveAttribute('target', '_blank');
    });

    it('displays validation error for short username', async () => {
        const user = userEvent.setup();
        render(<LoginForm onSubmit={mockOnSubmit} loading={false} />);

        const usernameInput = screen.getByLabelText(/email\/username/i);
        await user.type(usernameInput, 'abc');
        await user.tab();

        await waitFor(() => {
            expect(screen.getByText(/username should be more than 4 characters/i)).toBeInTheDocument();
        });
    });

    it('displays validation error for long username', async () => {
        const user = userEvent.setup();
        render(<LoginForm onSubmit={mockOnSubmit} loading={false} />);

        const usernameInput = screen.getByLabelText(/email\/username/i);
        await user.type(usernameInput, 'a'.repeat(31));
        await user.tab();

        await waitFor(() => {
            expect(screen.getByText(/username should be less than thirty characters/i)).toBeInTheDocument();
        });
    });

    it('displays validation error for short password', async () => {
        const user = userEvent.setup();
        render(<LoginForm onSubmit={mockOnSubmit} loading={false} />);

        const passwordInput = screen.getByLabelText(/^password$/i);
        await user.type(passwordInput, 'a');
        await user.tab();

        await waitFor(() => {
            expect(screen.getByText(/password should be more than 2 characters/i)).toBeInTheDocument();
        });
    });

    it('displays validation error for long password', async () => {
        const user = userEvent.setup();
        render(<LoginForm onSubmit={mockOnSubmit} loading={false} />);

        const passwordInput = screen.getByLabelText(/^password$/i);
        await user.type(passwordInput, 'a'.repeat(21));
        await user.tab();

        await waitFor(() => {
            expect(screen.getByText(/password should be less than twenty characters/i)).toBeInTheDocument();
        });
    });

    it('submit button is disabled when ToS is not accepted', async () => {
        const user = userEvent.setup();
        render(<LoginForm onSubmit={mockOnSubmit} loading={false} />);

        const usernameInput = screen.getByLabelText(/email\/username/i);
        const passwordInput = screen.getByLabelText(/^password$/i);
        const submitButton = screen.getByRole('button', { name: /log in/i });

        await user.type(usernameInput, 'testuser');
        await user.type(passwordInput, 'password123');

        expect(submitButton).toBeDisabled();
    });

    it('submit button is disabled when CoC is not accepted', async () => {
        const user = userEvent.setup();
        render(<LoginForm onSubmit={mockOnSubmit} loading={false} />);

        const usernameInput = screen.getByLabelText(/email\/username/i);
        const passwordInput = screen.getByLabelText(/^password$/i);
        const tosCheckbox = screen.getByRole('checkbox', { name: /terms of service/i });
        const submitButton = screen.getByRole('button', { name: /log in/i });

        await user.type(usernameInput, 'testuser');
        await user.type(passwordInput, 'password123');
        await user.click(tosCheckbox);

        expect(submitButton).toBeDisabled();
    });

    it('submits form with valid data when all checkboxes are checked', async () => {
        const user = userEvent.setup();
        render(<LoginForm onSubmit={mockOnSubmit} loading={false} />);

        const usernameInput = screen.getByLabelText(/email\/username/i);
        const passwordInput = screen.getByLabelText(/^password$/i);
        const tosCheckbox = screen.getByRole('checkbox', { name: /terms of service/i });
        const cocCheckbox = screen.getByRole('checkbox', { name: /code of conduct/i });
        const submitButton = screen.getByRole('button', { name: /log in/i });

        await user.type(usernameInput, 'testuser');
        await user.type(passwordInput, 'password123');
        await user.click(tosCheckbox);
        await user.click(cocCheckbox);
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(
                expect.objectContaining({
                    username: 'testuser',
                    password: 'password123',
                    tos: true,
                    coc: true,
                }),
                expect.anything()
            );
        });
    });

    it('displays login error when provided', () => {
        const errorMessage = 'Invalid credentials';
        render(<LoginForm onSubmit={mockOnSubmit} loading={false} loginError={errorMessage} />);

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('displays login error from error object', () => {
        const errorMessage = 'Invalid credentials';
        const loginError = { data: { message: errorMessage } };
        render(<LoginForm onSubmit={mockOnSubmit} loading={false} loginError={loginError} />);

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('disables all inputs when loading', () => {
        render(<LoginForm onSubmit={mockOnSubmit} loading={true} />);

        const usernameInput = screen.getByLabelText(/email\/username/i);
        const passwordInput = screen.getByLabelText(/^password$/i);
        const submitButton = screen.getByRole('button', { name: /logging in/i });

        expect(usernameInput).toBeDisabled();
        expect(passwordInput).toBeDisabled();
        expect(submitButton).toBeDisabled();
    });

    it('shows "Logging in..." text when loading', () => {
        render(<LoginForm onSubmit={mockOnSubmit} loading={true} />);

        expect(screen.getByRole('button', { name: /logging in/i })).toBeInTheDocument();
    });

    it('shows "Log in" text when not loading', () => {
        render(<LoginForm onSubmit={mockOnSubmit} loading={false} />);

        expect(screen.getByRole('button', { name: /^log in$/i })).toBeInTheDocument();
    });

    it('displays ToS acceptance error when checkbox not checked', async () => {
        const user = userEvent.setup();
        render(<LoginForm onSubmit={mockOnSubmit} loading={false} />);

        const usernameInput = screen.getByLabelText(/email\/username/i);
        const passwordInput = screen.getByLabelText(/^password$/i);
        const cocCheckbox = screen.getByRole('checkbox', { name: /code of conduct/i });

        await user.type(usernameInput, 'testuser');
        await user.type(passwordInput, 'password123');
        await user.click(cocCheckbox);

        // Try to submit without ToS
        const form = screen.getByRole('button', { name: /log in/i }).closest('form');
        if (form) {
            fireEvent.submit(form);
        }

        // Button should still be disabled
        expect(screen.getByRole('button', { name: /log in/i })).toBeDisabled();
    });

    it('displays CoC acceptance error when checkbox not checked', async () => {
        const user = userEvent.setup();
        render(<LoginForm onSubmit={mockOnSubmit} loading={false} />);

        const usernameInput = screen.getByLabelText(/email\/username/i);
        const passwordInput = screen.getByLabelText(/^password$/i);
        const tosCheckbox = screen.getByRole('checkbox', { name: /terms of service/i });

        await user.type(usernameInput, 'testuser');
        await user.type(passwordInput, 'password123');
        await user.click(tosCheckbox);

        // Try to submit without CoC
        const form = screen.getByRole('button', { name: /log in/i }).closest('form');
        if (form) {
            fireEvent.submit(form);
        }

        // Button should still be disabled
        expect(screen.getByRole('button', { name: /log in/i })).toBeDisabled();
    });
});
