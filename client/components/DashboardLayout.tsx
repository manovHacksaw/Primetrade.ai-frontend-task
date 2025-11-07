'use client';

import { ReactNode } from 'react';
import Navbar from './Navbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <Navbar />
      <main style={{
        maxWidth: 'min(90ch, 1200px)',
        margin: '0 auto',
        padding: '2rem 1.5rem',
      }} className="sm:px-8">
        {children}
      </main>
    </div>
  );
}

