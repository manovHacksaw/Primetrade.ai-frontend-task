'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/axios';
import { setToken } from '@/lib/auth';

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: { username?: string; email?: string; password?: string } = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      await api.post('/auth/register', { username, email, password });
      // After registration, automatically log in
      const loginResponse = await api.post('/auth/login', { email, password });
      setToken(loginResponse.data.token);
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      setErrors({
        password: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background)', padding: '1rem' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div style={{ backgroundColor: 'var(--background)', border: '1px solid var(--foreground-border)', borderRadius: '0.5rem', padding: '1.5rem 2rem' }} className="sm:p-8 space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2 text-center"
          >
            <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--foreground)' }} className="sm:text-3xl">Create an account</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)' }} className="sm:text-sm">
              Join us to start creating and managing your blog posts. Get started with your first post today.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            {/* Username Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--background)',
                  border: `1px solid ${errors.username ? '#ef4444' : 'var(--foreground-border)'}`,
                  borderRadius: '0.5rem',
                  outline: 'none',
                  color: 'var(--foreground)',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  if (!errors.username) {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.boxShadow = `0 0 0 2px var(--accent)33`;
                  }
                }}
                onBlur={(e) => {
                  if (!errors.username) {
                    e.currentTarget.style.borderColor = 'var(--foreground-border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
                className="sm:text-base"
              />
              <AnimatePresence>
                {errors.username && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#ef4444', fontWeight: 400 }}
                    className="sm:text-sm"
                  >
                    {errors.username}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--background)',
                  border: `1px solid ${errors.email ? '#ef4444' : 'var(--foreground-border)'}`,
                  borderRadius: '0.5rem',
                  outline: 'none',
                  color: 'var(--foreground)',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  if (!errors.email) {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.boxShadow = `0 0 0 2px var(--accent)33`;
                  }
                }}
                onBlur={(e) => {
                  if (!errors.email) {
                    e.currentTarget.style.borderColor = 'var(--foreground-border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
                className="sm:text-base"
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#ef4444', fontWeight: 400 }}
                    className="sm:text-sm"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  paddingRight: '2.5rem',
                  backgroundColor: 'var(--background)',
                  border: `1px solid ${(errors.password || errors.general) ? '#ef4444' : 'var(--foreground-border)'}`,
                  borderRadius: '0.5rem',
                  outline: 'none',
                  color: 'var(--foreground)',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                }}
                onFocus={(e) => {
                  if (!errors.password && !errors.general) {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.boxShadow = `0 0 0 2px var(--accent)33`;
                  }
                }}
                onBlur={(e) => {
                  if (!errors.password && !errors.general) {
                    e.currentTarget.style.borderColor = 'var(--foreground-border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
                className="sm:text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--foreground-muted)',
                  transition: 'color 0.2s',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--foreground)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--foreground-muted)';
                }}
              >
                <svg
                  style={{ width: '1.25rem', height: '1.25rem' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {showPassword ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  ) : (
                    <>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </>
                  )}
                </svg>
              </button>
              <AnimatePresence>
                {(errors.password || errors.general) && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#ef4444', fontWeight: 400 }}
                    className="sm:text-sm"
                  >
                    {errors.password || errors.general}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Signup Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              style={{
                width: '100%',
                backgroundColor: 'var(--foreground-border)',
                color: 'var(--foreground)',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontWeight: 500,
                transition: 'background-color 0.2s',
                border: '1px solid var(--foreground-border)',
                fontSize: '0.875rem',
                opacity: isSubmitting ? 0.5 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = 'var(--foreground-secondary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.backgroundColor = 'var(--foreground-border)';
                }
              }}
              className="sm:text-base"
            >
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </motion.button>
          </motion.form>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--foreground-muted)' }}
            className="sm:text-sm"
          >
            Already have an account?{' '}
            <Link
              href="/login"
              style={{
                fontWeight: 600,
                color: 'var(--foreground)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--foreground)';
              }}
            >
              Login now
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
