import React from 'react';

export const SkeletonPost = () => {
  return (
    <div className="glass p-6 rounded-2xl relative animate-pulse flex flex-col gap-4">
      <div className="h-4 bg-slate-300 rounded w-3/4"></div>
      <div className="h-4 bg-slate-300 rounded w-1/2"></div>
      <div className="mt-4 flex items-center gap-2">
        <div className="h-3 bg-slate-300 rounded w-1/4"></div>
        <div className="h-3 bg-slate-300 rounded w-1/4"></div>
      </div>
    </div>
  );
};

export const SkeletonProfile = () => {
  return (
    <div className="animate-pulse flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-slate-300 rounded-full"></div>
        <div className="flex flex-col gap-2">
          <div className="h-6 bg-slate-300 rounded w-48"></div>
          <div className="h-4 bg-slate-300 rounded w-32"></div>
        </div>
      </div>
      <div className="h-10 bg-slate-300 rounded w-full"></div>
      <div className="h-24 bg-slate-300 rounded w-full"></div>
    </div>
  );
};
