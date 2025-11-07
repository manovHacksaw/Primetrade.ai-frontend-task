'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { removeToken } from '@/lib/auth';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}IST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    removeToken();
    router.push('/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/posts', label: 'Posts' },
    { href: '/post/create', label: 'Create' },
    { href: '/settings', label: 'Settings' },
  ];

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav
      style={{
        borderBottom: '1px solid var(--foreground-border)',
        background: 'var(--background)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(8px)',
        backgroundColor: 'var(--background)',
      }}
      className="relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/dashboard" className="flex items-center space-x-2">
              <span style={{ color: 'var(--foreground)' }} className="text-xl font-bold">Primetrade.ai</span>
            </Link>
          </motion.div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      transition: 'all 0.2s',
                      backgroundColor: isActive ? 'var(--foreground-border)' : 'transparent',
                      color: isActive ? 'var(--foreground)' : 'var(--foreground-muted)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'var(--foreground-border)';
                        e.currentTarget.style.color = 'var(--foreground)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--foreground-muted)';
                      }
                    }}
                  >
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Right Side - Time, Theme Switcher, Logout, Mobile Menu */}
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {/* Time - Hidden on small screens */}
            <div className="hidden sm:flex items-center gap-2">
              <motion.div
                style={{
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-green)',
                }}
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--foreground)', fontFamily: 'monospace' }}>{currentTime}</div>
            </div>
            <ThemeSwitcher />
            <button
              onClick={handleLogout}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#ef4444',
                border: '1px solid var(--foreground-border)',
                borderRadius: '0.375rem',
                backgroundColor: 'transparent',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#ef4444';
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--foreground-border)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              className="hidden sm:block"
            >
              Logout
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                padding: '0.5rem',
                color: 'var(--foreground)',
              }}
              className="md:hidden"
              aria-label="Toggle menu"
            >
              <motion.svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </motion.svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation - Slide from right */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    zIndex: 99998,
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)',
                  }}
                  className="md:hidden"
                />
                
                {/* Slide-in menu from right */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween', duration: 0.3 }}
                  style={{
                    zIndex: 99999,
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    height: '100%',
                    width: '16rem',
                    backgroundColor: 'var(--background)',
                    borderLeft: '1px solid var(--foreground-border)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  }}
                  className="md:hidden"
                >
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid var(--foreground-border)' }}>
                      <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--foreground)' }}>Menu</span>
                      <button
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          padding: '0.5rem',
                          color: 'var(--foreground)',
                          borderRadius: '0.5rem',
                          transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--foreground-border)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Navigation Items */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                      {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <div key={item.href}>
                            <Link
                              href={item.href}
                              onClick={() => setMobileMenuOpen(false)}
                              style={{
                                display: 'block',
                                padding: '0.75rem 1rem',
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                transition: 'all 0.2s',
                                backgroundColor: isActive ? 'var(--foreground-border)' : 'transparent',
                                color: isActive ? 'var(--foreground)' : 'var(--foreground-muted)',
                              }}
                              onMouseEnter={(e) => {
                                if (!isActive) {
                                  e.currentTarget.style.backgroundColor = 'var(--foreground-border)';
                                  e.currentTarget.style.color = 'var(--foreground)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isActive) {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                  e.currentTarget.style.color = 'var(--foreground-muted)';
                                }
                              }}
                            >
                              {item.label}
                            </Link>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Footer with Logout */}
                    <div style={{ padding: '1rem', borderTop: '1px solid var(--foreground-border)' }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.75rem 1rem',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: '#ef4444',
                          border: '1px solid var(--foreground-border)',
                          transition: 'all 0.2s',
                          borderRadius: '0.5rem',
                          backgroundColor: 'transparent',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#ef4444';
                          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--foreground-border)';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </nav>
  );
}