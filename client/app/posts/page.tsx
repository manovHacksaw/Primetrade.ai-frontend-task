'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import api from '@/lib/axios';
import { isAuthenticated } from '@/lib/auth';

interface Post {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    fetchPosts();
  }, [router]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
      setFilteredPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/posts/${postId}`);
      setPosts(posts.filter((p) => p._id !== postId));
      setFilteredPosts(filteredPosts.filter((p) => p._id !== postId));
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout>
        {/* Page Heading - Strong and prominent */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2rem' }}
        >
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--foreground)',
            letterSpacing: '-0.02em',
            marginBottom: '1.5rem',
          }} className="sm:text-3xl">
            All Posts
          </h1>

          {/* Unified Search + Create Post Header Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}>
            {/* Search Input - Left side */}
            <div style={{ flex: '1', minWidth: '200px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--foreground-border)',
                  borderRadius: '0.5rem',
                  outline: 'none',
                  color: 'var(--foreground)',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                }}  
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.boxShadow = `0 0 0 2px var(--accent)33`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--foreground-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onMouseEnter={(e) => {
                  if (document.activeElement !== e.currentTarget) {
                    e.currentTarget.style.borderColor = 'var(--foreground-secondary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (document.activeElement !== e.currentTarget) {
                    e.currentTarget.style.borderColor = 'var(--foreground-border)';
                  }
                }}
                className="sm:text-base"
              />
            </div>

            {/* Create Post Button - Right side */}
            <Link
              href="/post/create"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--foreground-border)',
                border: '1px solid var(--foreground-border)',
                color: 'var(--foreground)',
                borderRadius: '0.5rem',
                fontWeight: 500,
                fontSize: '0.875rem',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--foreground-secondary)';
                e.currentTarget.style.borderColor = 'var(--foreground-secondary)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--foreground-border)';
                e.currentTarget.style.borderColor = 'var(--foreground-border)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              className="sm:text-base"
            >
              Create Post
            </Link>
          </div>
        </motion.div>

        {/* Posts List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                style={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--foreground-border)',
                  borderRadius: '0.5rem',
                  padding: '1.25rem 1.5rem',
                }}
                className="animate-pulse"
              >
                <div style={{ height: '1.5rem', backgroundColor: 'var(--foreground-border)', borderRadius: '0.25rem', width: '75%', marginBottom: '0.75rem' }}></div>
                <div style={{ height: '1rem', backgroundColor: 'var(--foreground-border)', borderRadius: '0.25rem', width: '50%' }}></div>
              </motion.div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--foreground-border)',
              borderRadius: '0.5rem',
              padding: '4rem 2rem',
              textAlign: 'center',
            }}
          >
            <p style={{
              fontSize: '1rem',
              color: 'var(--foreground-muted)',
              marginBottom: '1.5rem',
            }}>
              {searchQuery ? 'No posts found matching your search.' : 'No posts yet. Start writing your first one.'}
            </p>
            {!searchQuery && (
              <Link
                href="/post/create"
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--foreground-border)',
                  border: '1px solid var(--foreground-border)',
                  color: 'var(--foreground)',
                  borderRadius: '0.5rem',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--foreground-secondary)';
                  e.currentTarget.style.borderColor = 'var(--foreground-secondary)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--foreground-border)';
                  e.currentTarget.style.borderColor = 'var(--foreground-border)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Create Your First Post
              </Link>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <AnimatePresence mode="wait">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post._id}
                  variants={itemVariants}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--foreground-border)',
                    borderRadius: '0.5rem',
                    padding: '1.25rem 1.5rem',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '1.5rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--foreground-secondary)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--foreground-border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Post Content - Title and Metadata */}
                  <Link
                    href={`/post/${post._id}`}
                    style={{
                      flex: '1',
                      minWidth: 0,
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      const card = e.currentTarget.closest('[style*="border"]') as HTMLElement;
                      if (card) {
                        card.style.borderColor = 'var(--accent)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      const card = e.currentTarget.closest('[style*="border"]') as HTMLElement;
                      if (card) {
                        card.style.borderColor = 'var(--foreground-secondary)';
                      }
                    }}
                  >
                    {/* Title */}
                    <h2 style={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: 'var(--foreground)',
                      marginBottom: '0.5rem',
                      lineHeight: '1.4',
                      transition: 'color 0.2s',
                    }} className="line-clamp-2">
                      {post.title}
                    </h2>
                    
                    {/* Metadata */}
                    <p style={{
                      fontSize: '0.875rem',
                      color: 'var(--foreground-muted)',
                      fontWeight: 400,
                    }}>
                      {formatDate(post.createdAt)}
                      {post.updatedAt !== post.createdAt && (
                        <> · Updated {formatDate(post.updatedAt)}</>
                      )}
                    </p>
                  </Link>

                  {/* Actions - Edit and Delete buttons on the right */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    flexShrink: 0,
                  }}>
                    <Link
                      href={`/post/edit/${post._id}`}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: 400,
                        color: 'var(--foreground-muted)',
                        border: '1px solid var(--foreground-border)',
                        borderRadius: '0.375rem',
                        backgroundColor: 'transparent',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--accent)';
                        e.currentTarget.style.color = 'var(--accent)';
                        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--foreground-border)';
                        e.currentTarget.style.color = 'var(--foreground-muted)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={(e) => handleDelete(post._id, e)}
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.875rem',
                        fontWeight: 400,
                        color: 'var(--foreground-muted)',
                        border: '1px solid var(--foreground-border)',
                        borderRadius: '0.375rem',
                        backgroundColor: 'transparent',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                        e.currentTarget.style.color = 'rgba(239, 68, 68, 0.8)';
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--foreground-border)';
                        e.currentTarget.style.color = 'var(--foreground-muted)';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
    </DashboardLayout>
  );
}
