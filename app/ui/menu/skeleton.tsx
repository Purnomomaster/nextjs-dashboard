import React from 'react';

const MenuTableSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
    </div>
  );
};

export default MenuTableSkeleton;