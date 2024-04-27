import React from 'react';

const Lessonlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col h-full w-full">{children}</div>
    </div>
  );
};

export default Lessonlayout;
