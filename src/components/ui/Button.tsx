import styles from './Button.module.css';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  children,
  onClick,
  className = '',
}: ButtonProps) {
  const buttonClass = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    loading && styles.loading,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={buttonClass} onClick={onClick} disabled={disabled || loading} type="button">
      {loading && <span className={styles.spinner} />}
      <span className={loading ? styles.content : ''}>{children}</span>
    </button>
  );
}
