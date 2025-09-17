import React from 'react';

const SkeletonLoader = ({ 
  type = 'card', 
  count = 1, 
  className = '',
  height = 'h-4',
  width = 'w-full'
}) => {
  const SkeletonItem = () => (
    <div className={`skeleton rounded ${height} ${width} ${className}`}></div>
  );

  const SkeletonCard = () => (
    <div className="card animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="skeleton rounded-full h-12 w-12"></div>
        <div className="space-y-2 flex-1">
          <div className="skeleton h-4 w-3/4"></div>
          <div className="skeleton h-3 w-1/2"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-5/6"></div>
        <div className="skeleton h-4 w-4/6"></div>
      </div>
      <div className="flex space-x-2 mt-4">
        <div className="skeleton h-6 w-16 rounded-full"></div>
        <div className="skeleton h-6 w-20 rounded-full"></div>
      </div>
    </div>
  );

  const SkeletonList = () => (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
          <div className="skeleton rounded-full h-10 w-10"></div>
          <div className="space-y-2 flex-1">
            <div className="skeleton h-4 w-1/3"></div>
            <div className="skeleton h-3 w-1/2"></div>
          </div>
          <div className="skeleton h-6 w-16 rounded-full"></div>
        </div>
      ))}
    </div>
  );

  const SkeletonTable = () => (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex space-x-4 p-4 bg-white/5 rounded-lg">
          <div className="skeleton h-4 w-1/4"></div>
          <div className="skeleton h-4 w-1/4"></div>
          <div className="skeleton h-4 w-1/4"></div>
          <div className="skeleton h-4 w-1/4"></div>
        </div>
      ))}
    </div>
  );

  const SkeletonText = () => (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonItem key={index} />
      ))}
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return Array.from({ length: count }).map((_, index) => (
          <SkeletonCard key={index} />
        ));
      case 'list':
        return <SkeletonList />;
      case 'table':
        return <SkeletonTable />;
      case 'text':
        return <SkeletonText />;
      default:
        return <SkeletonItem />;
    }
  };

  return (
    <div className={type === 'card' ? 'space-y-4' : ''}>
      {renderSkeleton()}
    </div>
  );
};

export default SkeletonLoader;
