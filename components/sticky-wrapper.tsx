import React from 'react';

const StickyWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="hidden lg:block w-[368px] sticky self-start top-6   ">
      <div className="min-h-[calc(100vh-48px)]   flex flex-col gap-y-4 ">{children}</div>
    </div>
  );
};

export default StickyWrapper;
