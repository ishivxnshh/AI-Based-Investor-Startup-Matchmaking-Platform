import React from 'react';

const Switch = ({ 
  checked = false, 
  onChange, 
  label,
  disabled = false,
  size = 'md',
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: {
      switch: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4'
    },
    md: {
      switch: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5'
    },
    lg: {
      switch: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7'
    }
  };

  const sizeConfig = sizes[size] || sizes.md;

  return (
    <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div className={`
          ${sizeConfig.switch}
          ${checked ? 'bg-gradient-to-r from-purple-500 to-violet-600' : 'bg-gray-600'}
          rounded-full transition-colors duration-300
        `}>
          <div className={`
            ${sizeConfig.thumb}
            ${checked ? sizeConfig.translate : 'translate-x-0.5'}
            absolute top-0.5 left-0.5
            bg-white rounded-full
            transition-transform duration-300
            shadow-md
          `} />
        </div>
      </div>
      {label && (
        <span className="text-sm font-medium text-gray-200">{label}</span>
      )}
    </label>
  );
};

export default Switch;
