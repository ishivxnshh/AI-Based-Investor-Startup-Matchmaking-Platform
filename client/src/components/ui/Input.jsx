import React, { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  icon, 
  rightIcon,
  helperText,
  className = '', 
  containerClassName = '',
  ...props 
}, ref) => {
  const hasError = !!error;
  
  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-200">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 
            ${icon ? 'pl-10' : ''} 
            ${rightIcon ? 'pr-10' : ''}
            bg-white/10 backdrop-blur-sm 
            border ${hasError ? 'border-red-400/50' : 'border-purple-400/30'}
            rounded-lg text-white placeholder-gray-400
            focus:outline-none focus:ring-2 
            ${hasError ? 'focus:ring-red-500' : 'focus:ring-purple-500'}
            focus:border-transparent
            transition-all duration-300
            hover:bg-white/15
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1 animate-fade-in">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-400">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
