import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({ size = 'default', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary-600`} />
    </div>
  );
};

export const LoadingSpinner = ({ text = 'Loading...', size = 'default' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader size={size} />
      <p className="text-secondary-600 text-sm">{text}</p>
    </div>
  );
};

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div className="text-center">
        <Loader size="lg" />
        <p className="mt-4 text-secondary-600">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;