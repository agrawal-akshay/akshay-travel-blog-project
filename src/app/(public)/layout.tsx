import React from 'react';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {/* 
        Add top padding to main to account for fixed navbar.
        flex-1 ensures main content stretches to push footer to bottom 
      */}
      <main className="flex-1 pt-20 md:pt-24 min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}