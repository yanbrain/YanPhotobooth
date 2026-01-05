import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
}: ButtonProps) {
  const baseStyles = 'font-cyber font-semibold uppercase tracking-[0.2em] transition-all duration-200 relative overflow-hidden group border';

  const variantStyles = {
    primary: `
      bg-cyber-dark text-neon-cyan border-neon-cyan/70
      shadow-neon-cyan hover:border-neon-cyan hover:text-white
      before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-neon-cyan/60
    `,
    secondary: `
      bg-cyber-dark text-neon-purple border-neon-purple/70
      shadow-neon-purple hover:border-neon-purple hover:text-white
      before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-neon-purple/60
    `,
    outline: `
      bg-transparent border-neon-cyan/60 text-neon-cyan
      hover:border-neon-cyan hover:text-white hover:shadow-neon-cyan
    `,
    ghost: `
      bg-cyber-dark/60 border-neon-cyan/30
      text-neon-cyan/80 hover:border-neon-cyan hover:text-neon-cyan
    `,
  };

  const sizeStyles = {
    sm: 'px-5 py-2 text-xs rounded-none',
    md: 'px-8 py-3 text-sm rounded-none',
    lg: 'px-12 py-4 text-base rounded-none',
  };

  const disabledStyles = disabled
    ? 'opacity-40 cursor-not-allowed grayscale'
    : 'cursor-pointer active:scale-95';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
