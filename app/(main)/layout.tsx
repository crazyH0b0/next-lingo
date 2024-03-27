import MobileHeader from '@/components/mobile-header';
import Sidebar from '@/components/sidebar';
import React from 'react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <MobileHeader />
      <Sidebar className="hidden lg:block " />
      <main className="lg:pl-[256px]  h-full pt-[50px] lg:pt-0 ">
        <div className="h-full">{children}</div>
      </main>
    </>
  );
};

export default MainLayout;