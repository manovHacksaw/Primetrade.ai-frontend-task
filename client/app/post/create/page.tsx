'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import RichTextEditor from '@/components/RichTextEditor';
import api from '@/lib/axios';
import { isAuthenticated } from '@/lib/auth';

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<{ title?: string; content?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  const validate = () => {
    const newErrors: { title?: string; content?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!content.trim()) {
      newErrors.content = 'Content is required';
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
      await api.post('/posts', { title, content });
      router.push('/posts');
    } catch (error: any) {
      setErrors({
        general: error.response?.data?.message || 'Failed to create post. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '1.5rem' }}
          className="sm:text-2xl lg:text-3xl sm:mb-8"
        >
          Create New Post
        </motion.h1>

        <AnimatePresence>
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                marginBottom: '1.5rem',
                padding: '1rem',
                backgroundColor: 'var(--background)',
                border: '1px solid #ef4444',
                borderRadius: '0.5rem',
                color: '#ef4444',
                fontSize: '0.875rem',
              }}
            >
              {errors.general}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label htmlFor="title" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground)', marginBottom: '0.5rem' }}>
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--background)',
                border: `1px solid ${errors.title ? '#ef4444' : 'var(--foreground-border)'}`,
                borderRadius: '0.5rem',
                outline: 'none',
                color: 'var(--foreground)',
                fontSize: '0.875rem',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                if (!errors.title) {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.boxShadow = `0 0 0 2px var(--accent)33`;
                }
              }}
              onBlur={(e) => {
                if (!errors.title) {
                  e.currentTarget.style.borderColor = 'var(--foreground-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
              className="sm:text-base"
            />
            <AnimatePresence>
              {errors.title && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#ef4444' }}
                >
                  {errors.title}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="content" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: 'var(--foreground)', marginBottom: '0.5rem' }}>
              Content
            </label>
            <RichTextEditor
              content={content}
              onChange={(html) => setContent(html)}
              error={!!errors.content}
            />
            <AnimatePresence>
              {errors.content && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#ef4444' }}
                >
                  {errors.content}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
          >
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: 'var(--foreground-border)',
                color: 'var(--foreground)',
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
              {isSubmitting ? 'Saving...' : 'Save Post'}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => router.push('/posts')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: 'var(--background)',
                border: '1px solid var(--foreground-border)',
                color: 'var(--foreground-muted)',
                borderRadius: '0.5rem',
                fontWeight: 500,
                transition: 'all 0.2s',
                fontSize: '0.875rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.color = 'var(--foreground)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--foreground-border)';
                e.currentTarget.style.color = 'var(--foreground-muted)';
              }}
              className="sm:text-base"
            >
              Cancel
            </motion.button>
          </motion.div>
        </motion.form>
    </DashboardLayout>
  );
}
