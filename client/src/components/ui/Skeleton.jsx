import React from 'react';

const Skeleton = ({ className = '', variant = 'default', ...props }) => {
  const baseStyles = 'animate-pulse bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] rounded';
  
  const variants = {
    default: 'h-4 w-full',
    text: 'h-4 w-3/4',
    title: 'h-8 w-1/2',
    avatar: 'h-12 w-12 rounded-full',
    card: 'h-48 w-full',
    button: 'h-10 w-24',
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}
      {...props}
    />
  );
};

const SkeletonCard = () => (
  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
    <div className="flex items-center gap-4 mb-4">
      <Skeleton variant="avatar" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="title" />
        <Skeleton variant="text" />
      </div>
    </div>
    <div className="space-y-3">
      <Skeleton />
      <Skeleton />
      <Skeleton className="w-2/3" />
    </div>
    <div className="mt-4 flex gap-2">
      <Skeleton variant="button" />
      <Skeleton variant="button" />
    </div>
  </div>
);

const SkeletonTable = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
        <Skeleton variant="avatar" className="h-10 w-10" />
        <div className="flex-1 space-y-2">
          <Skeleton className="w-1/3" />
          <Skeleton className="w-1/2" />
        </div>
        <Skeleton variant="button" />
      </div>
    ))}
  </div>
);

Skeleton.Card = SkeletonCard;
Skeleton.Table = SkeletonTable;

export default Skeleton;
