import { forwardRef } from 'react';
import styles from './Button.module.css';
import type { ButtonProps } from './types';
import { cn } from '@/lib/utils';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'medium',
      icon: Icon,
      iconPosition = 'left',
      isLoading = false,
      fullWidth = false,
      className,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const buttonClasses = cn(
      styles.button,
      styles[variant],
      styles[size],
      fullWidth && styles.fullWidth,
      className
    );

    const iconClasses = cn(
      styles.icon,
      iconPosition === 'left' ? styles.iconLeft : styles.iconRight
    );

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        type={type}
        {...props}
      >
        {isLoading ? (
          <span className={styles.loading}>⟳</span>
        ) : (
          <>
            {Icon && <Icon size={16} className={iconClasses} />}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
