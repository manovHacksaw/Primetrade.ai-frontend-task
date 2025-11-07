'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
      staggerChildren: 0.1,
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

export default function DashboardPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ username?: string; email?: string } | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    fetchUserInfo();
    fetchPosts();
  }, [router]);

  const fetchUserInfo = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
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
        {/* Welcome Section - Increased spacing and stronger hierarchy */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: '3rem', marginTop: '1rem' }}
        >
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: 'var(--foreground)',
            marginBottom: '0.75rem',
            letterSpacing: '-0.02em',
          }} className="sm:text-3xl">
            Welcome back{user?.username ? `, ${user.username}` : ''}!
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--foreground-muted)',
            fontWeight: 400,
          }} className="sm:text-base">
            Manage your blog posts and content from here.
          </p>
        </motion.div>

        {/* Stats Cards - Only Total Posts and Updated This Week */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ marginBottom: '3rem' }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {/* Total Posts Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -2 }}
            style={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--foreground-border)',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              minHeight: '120px',
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
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: 'var(--foreground)',
              lineHeight: '1',
              marginBottom: '0.5rem',
            }}>{posts.length}</div>
            <div style={{
              fontSize: '0.875rem',
              color: 'var(--foreground-muted)',
              fontWeight: 400,
            }}>Total Posts</div>
          </motion.div>

          {/* Updated This Week Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -2 }}
            style={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--foreground-border)',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              minHeight: '120px',
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
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: 'var(--foreground)',
              lineHeight: '1',
              marginBottom: '0.5rem',
            }}>
              {posts.filter((p) => {
                const postDate = new Date(p.updatedAt);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return postDate > weekAgo;
              }).length}
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: 'var(--foreground-muted)',
              fontWeight: 400,
            }}>Updated This Week</div>
          </motion.div>
        </motion.div>

        {/* Recent Posts Section - Improved spacing and alignment */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ marginBottom: '2rem' }}
        >
          {/* Section Header - Title, View All, and Create New Post aligned */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            gap: '1rem',
            flexWrap: 'wrap',
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: 'var(--foreground)',
              letterSpacing: '-0.01em',
            }}>Recent Posts</h2>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginLeft: 'auto',
            }}>
              <Link
                href="/posts"
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--foreground-muted)',
                  fontWeight: 400,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--foreground)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--foreground-muted)';
                }}
              >
                View all 
              </Link>
              <Link
                href="/post/create"
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--foreground)',
                  backgroundColor: 'var(--foreground-border)',
                  border: '1px solid var(--foreground-border)',
                  borderRadius: '0.375rem',
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
              >
                Create New Post
              </Link>
            </div>
          </div>

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
          ) : posts.length === 0 ? (
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
                No posts yet. Start writing your first one.
              </p>
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
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {posts.slice(0, 5).map((post, index) => (
                <motion.div
                  key={post._id}
                  variants={itemVariants}
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={`/post/${post._id}`}
                    style={{
                      display: 'block',
                      backgroundColor: 'var(--background)',
                      border: '1px solid var(--foreground-border)',
                      borderRadius: '0.5rem',
                      padding: '1.25rem 1.5rem',
                      transition: 'all 0.2s',
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
                    <h3 style={{
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: 'var(--foreground)',
                      marginBottom: '0.5rem',
                      lineHeight: '1.4',
                    }} className="line-clamp-2">{post.title}</h3>
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
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
    </DashboardLayout>
  );
}
