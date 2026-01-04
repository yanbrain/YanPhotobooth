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
  const baseStyles = 'font-cyber font-bold uppercase tracking-widest transition-all duration-300 relative overflow-hidden group';

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-neon-cyan via-cyber-blue to-neon-purple
      text-cyber-darker shadow-neon-cyan
      hover:shadow-neon-purple hover:scale-105
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
      before:translate-x-[-200%] before:transition-transform before:duration-700
      hover:before:translate-x-[200%]
    `,
    secondary: `
      bg-gradient-to-r from-neon-purple via-neon-pink to-cyber-pink
      text-white shadow-neon-pink
      hover:shadow-neon-purple hover:scale-105
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
      before:translate-x-[-200%] before:transition-transform before:duration-700
      hover:before:translate-x-[200%]
    `,
    outline: `
      border-2 border-neon-cyan text-neon-cyan bg-transparent
      hover:bg-neon-cyan/10 hover:shadow-neon-cyan
      hover:text-white hover:border-neon-purple
    `,
    ghost: `
      bg-cyber-dark/50 backdrop-blur-sm border border-neon-cyan/30
      text-neon-cyan hover:bg-neon-cyan/20
      hover:border-neon-cyan hover:shadow-glass
    `,
  };

  const sizeStyles = {
    sm: 'px-6 py-2 text-xs rounded',
    md: 'px-10 py-3 text-sm rounded-lg',
    lg: 'px-14 py-4 text-base rounded-xl',
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
