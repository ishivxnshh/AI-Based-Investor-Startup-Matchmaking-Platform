import React from 'react';

const cardVariants = {
  default: 'bg-white/10 backdrop-blur-sm border border-purple-500/30',
  gradient: 'bg-gradient-to-br from-purple-500/20 via-violet-500/10 to-transparent backdrop-blur-md border border-purple-400/30',
  glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
  solid: 'bg-gray-800/90 border border-gray-700',
};

const Card = ({ 
  children, 
  variant = 'default',
  hover = true,
  className = '',
  onClick,
  ...props 
}) => {
  const baseStyles = 'rounded-2xl p-6 shadow-lg transition-all duration-300';
  const variantStyles = cardVariants[variant] || cardVariants.default;
  const hoverStyles = hover ? 'hover:shadow-2xl hover:scale-[1.02] hover:border-purple-400/50' : '';
  const clickableStyles = onClick ? 'cursor-pointer active:scale-95' : '';

  return (
    <div
      className={`${baseStyles} ${variantStyles} ${hoverStyles} ${clickableStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-bold text-white ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-400 mt-1 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`${className}`}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-purple-500/20 ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
