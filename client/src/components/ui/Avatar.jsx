import React from 'react';

const avatarSizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-20 h-20 text-2xl',
};

const Avatar = ({ 
  src, 
  alt = 'Avatar', 
  size = 'md',
  initials,
  className = '',
  online = false,
  ...props 
}) => {
  const sizeStyles = avatarSizes[size] || avatarSizes.md;

  return (
    <div className={`relative inline-block ${className}`} {...props}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${sizeStyles} rounded-full object-cover ring-2 ring-purple-400/30`}
        />
      ) : (
        <div className={`${sizeStyles} rounded-full bg-gradient-to-r from-purple-500 to-violet-600 flex items-center justify-center text-white font-bold ring-2 ring-purple-400/30`}>
          {initials || alt.charAt(0).toUpperCase()}
        </div>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-gray-900 rounded-full"></span>
      )}
    </div>
  );
};

const AvatarGroup = ({ children, max = 3, className = '' }) => {
  const avatars = React.Children.toArray(children);
  const displayAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {displayAvatars.map((avatar, index) => (
        <div key={index} className="relative">
          {avatar}
        </div>
      ))}
      {remaining > 0 && (
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm font-semibold ring-2 ring-gray-900">
          +{remaining}
        </div>
      )}
    </div>
  );
};

Avatar.Group = AvatarGroup;

export default Avatar;
