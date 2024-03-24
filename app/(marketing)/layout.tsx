import React from 'react';
import Header from './header';
import Footer from './footer';

const MarktingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex flex-1 flex-col justify-center items-center">{children}</main>
      <Footer />
    </div>
  );
};

export default MarktingLayout;
