import React from 'react';

const Divider = ({ 
  orientation = 'horizontal',
  className = '',
  children,
  ...props 
}) => {
  if (orientation === 'vertical') {
    return (
      <div className={`w-px bg-gradient-to-b from-transparent via-purple-500/50 to-transparent ${className}`} {...props} />
    );
  }

  if (children) {
    return (
      <div className={`flex items-center gap-4 my-8 ${className}`} {...props}>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-purple-500/50" />
        <span className="text-sm text-gray-400 font-medium">{children}</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-purple-500/50 to-purple-500/50" />
      </div>
    );
  }

  return (
    <div className={`w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent my-8 ${className}`} {...props} />
  );
};

export default Divider;
