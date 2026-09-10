import React from 'react';

export const Loader = ({ fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      <span className="font-label-caps text-label-caps tracking-widest text-on-surface-variant mt-4">GLOW BEAUTY</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center w-full">
        {content}
      </div>
    );
  }

  return content;
};
