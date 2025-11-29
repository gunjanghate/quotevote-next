export interface LoadingSpinnerProps {
  /**
   * Size of the spinner in pixels
   * @default 80
   */
  size?: number;
  /**
   * Top margin for the spinner container
   * @default '15px'
   */
  marginTop?: string;
}

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * URL of the avatar image
   */
  src?: string;
  /**
   * Alt text for the image (required for accessibility)
   */
  alt?: string;
  /**
   * Fallback content when image is missing or fails to load.
   * Can be a string (typically initials) or a React node.
   * If not provided, initials will be generated from alt text.
   */
  fallback?: string | React.ReactNode;
  /**
   * Size variant: 'sm', 'md', 'lg', 'xl', or a custom number in pixels
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  /**
   * Optional click handler
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

