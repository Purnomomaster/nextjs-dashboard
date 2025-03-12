import React from 'react';

const MenuTableSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="mb-4 h-4 w-3/4 rounded bg-gray-200"></div>
      <div className="mb-4 h-4 w-1/2 rounded bg-gray-200"></div>
      <div className="mb-4 h-4 w-full rounded bg-gray-200"></div>
      <div className="mb-4 h-4 w-2/3 rounded bg-gray-200"></div>
      <div className="mb-4 h-4 w-1/4 rounded bg-gray-200"></div>
    </div>
  );
};

export default MenuTableSkeleton;
