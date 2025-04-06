"use client";

import Navbar from '@/components/navbar';

export default function NavWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
    </div>
  );
} 