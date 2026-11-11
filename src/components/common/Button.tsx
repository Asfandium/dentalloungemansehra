import React, { type ButtonHTMLAttributes } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

type CombinedButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<'button'>> &
  HTMLMotionProps<'button'>;

export interface ButtonProps extends CombinedButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp' | 'call';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer select-none rounded-xl';

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-6 py-3 text-base gap-2.5',
    lg: 'px-8 py-4 text-lg gap-3 font-extrabold',
    xl: 'px-10 py-4.5 text-xl gap-3.5 font-extrabold tracking-wide',
  };

  const variantStyles = {
    primary:
      'bg-[#000075] hover:bg-[#000045] text-white shadow-lg shadow-[#000075]/25 hover:shadow-xl active:bg-[#000033] focus-visible:ring-[#000075]',
    call:
      'bg-[#000075] hover:bg-[#000040] text-[#BFDBFE] hover:text-white shadow-md active:bg-[#000025] focus-visible:ring-[#000075]',
    secondary:
      'bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 active:bg-slate-950 focus-visible:ring-slate-900',
    outline:
      'border-2 border-[#000075] bg-white hover:bg-[#000075] text-[#000075] hover:text-white focus-visible:ring-[#000075] shadow-xs',
    ghost:
      'text-[#000075] hover:text-[#000045] hover:bg-blue-50/90 active:bg-blue-100/70 focus-visible:ring-[#000075]',
    whatsapp:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 hover:shadow-xl focus-visible:ring-emerald-600',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      whileHover={{ y: disabled || isLoading ? 0 : -1 }}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          <span>{children as React.ReactNode}</span>
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};
