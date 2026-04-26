import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-full w-full p-8">
      <Loader2 className="w-8 h-8 text-pastel-blue animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
