import React from 'react';

const badgeVariants = {
  primary: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
  secondary: 'bg-gray-500/20 text-gray-300 border-gray-400/30',
  success: 'bg-green-500/20 text-green-300 border-green-400/30',
  warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
  danger: 'bg-red-500/20 text-red-300 border-red-400/30',
  info: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
};

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  icon,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 rounded-full font-semibold border transition-all duration-200';
  const variantStyles = badgeVariants[variant] || badgeVariants.primary;
  const sizeStyles = badgeSizes[size] || badgeSizes.md;

  return (
    <span
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
