
import React from 'react';

interface LoaderProps {
  message: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 min-h-[400px]">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
      <p className="mt-6 text-slate-300 text-lg text-center">{message}</p>
    </div>
  );
};
