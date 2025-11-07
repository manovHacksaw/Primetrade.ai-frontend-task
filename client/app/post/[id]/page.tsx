'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    fetchPost();
  }, [router, postId]);

  const fetchPost = async () => {
    try {
      const response = await api.get(`/posts/${postId}`);
      setPost(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ 
          maxWidth: '48rem', 
          margin: '0 auto',
          padding: '3rem 1.5rem',
          textAlign: 'center', 
          color: 'var(--foreground-muted)' 
        }}>
          <div style={{
            display: 'inline-block',
            width: '2rem',
            height: '2rem',
            border: '3px solid var(--foreground-border)',
            borderTopColor: 'var(--accent)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }} />
          <style jsx>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !post) {
    return (
      <DashboardLayout>
        <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
          <div
            style={{
              backgroundColor: 'var(--background)',
              border: '1px solid #ef4444',
              borderRadius: '0.75rem',
              padding: '2rem',
              textAlign: 'center',
            }}
          >
            <p style={{ color: '#ef4444', fontSize: '1.125rem', marginBottom: '1.5rem' }}>
              {error || 'Post not found'}
            </p>
            <Link
              href="/posts"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--foreground-border)',
                color: 'var(--foreground)',
                borderRadius: '0.5rem',
                fontSize: '0.9375rem',
                fontWeight: 500,
                transition: 'all 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--foreground-secondary)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--foreground-border)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              ← Back to Posts
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const isUpdated = post.updatedAt !== post.createdAt;

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Back Navigation */}
        <div style={{ marginBottom: '2.5rem' }}>
          <Link
            href="/posts"
            style={{
              fontSize: '0.9375rem',
              color: 'var(--foreground-muted)',
              transition: 'all 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--foreground)';
              e.currentTarget.style.transform = 'translateX(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--foreground-muted)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
              <path d="M10 12L6 8L10 4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Posts
          </Link>
        </div>

        {/* Article */}
        <article>
          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 700,
            color: 'var(--foreground)',
            lineHeight: '1.15',
            marginBottom: '1.5rem',
            letterSpacing: '-0.03em',
          }}>
            {post.title}
          </h1>

          {/* Metadata Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            paddingBottom: '2rem',
            marginBottom: '2.5rem',
            borderBottom: '2px solid var(--foreground-border)',
            flexWrap: 'wrap',
          }}>
            {/* Date Info */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.25rem',
              flex: 1,
            }}>
              <time style={{
                fontSize: '0.9375rem',
                color: 'var(--foreground-secondary)',
                fontWeight: 500,
                letterSpacing: '0.01em',
              }}>
                {formatDate(post.createdAt)}
              </time>
              {isUpdated && (
                <time style={{
                  fontSize: '0.8125rem',
                  color: 'var(--foreground-muted)',
                  fontStyle: 'italic',
                }}>
                  Updated {formatDate(post.updatedAt)}
                </time>
              )}
            </div>

            {/* Edit Button */}
            <Link
              href={`/post/edit/${post._id}`}
              style={{
                padding: '0.625rem 1.25rem',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                borderRadius: '0.5rem',
                fontWeight: 500,
                fontSize: '0.9375rem',
                transition: 'all 0.2s',
                border: '1px solid var(--foreground-border)',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--foreground-border)';
                e.currentTarget.style.borderColor = 'var(--foreground-secondary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--background)';
                e.currentTarget.style.borderColor = 'var(--foreground-border)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                <path d="M11.333 2A2.122 2.122 0 0 1 14 4.667L5.333 13.333l-4 1 1-4L11.333 2z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Edit Post
            </Link>
          </div>

          {/* Content - Professional Typography */}
          <div
            className="prose"
            style={{
              fontSize: '1.0625rem',
              lineHeight: '1.75',
              color: 'var(--foreground)',
              fontWeight: 400,
              letterSpacing: '0.002em',
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>

      {/* Enhanced Prose Styles */}
      <style jsx global>{`
        .prose {
          max-width: 100%;
        }
        
        .prose h1,
        .prose h2,
        .prose h3,
        .prose h4,
        .prose h5,
        .prose h6 {
          color: var(--foreground);
          font-weight: 700;
          letter-spacing: -0.02em;
          margin-top: 2em;
          margin-bottom: 0.75em;
          line-height: 1.3;
        }

        .prose h1 {
          font-size: 2.25rem;
          margin-top: 0;
        }

        .prose h2 {
          font-size: 1.875rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--foreground-border);
        }

        .prose h3 {
          font-size: 1.5rem;
        }

        .prose h4 {
          font-size: 1.25rem;
        }

        .prose p {
          margin-bottom: 1.5em;
          line-height: 1.8;
        }

        .prose strong {
          font-weight: 600;
          color: var(--foreground);
        }

        .prose em {
          font-style: italic;
          color: var(--foreground-secondary);
        }

        .prose a {
          color: var(--accent);
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 2px;
          transition: all 0.2s;
        }

        .prose a:hover {
          text-decoration-thickness: 2px;
          opacity: 0.8;
        }

        .prose ul,
        .prose ol {
          padding-left: 1.75rem;
          margin: 1.5em 0;
        }

        .prose li {
          margin: 0.75em 0;
          line-height: 1.75;
        }

        .prose li::marker {
          color: var(--foreground-muted);
        }

        .prose blockquote {
          border-left: 4px solid var(--accent);
          padding-left: 1.5rem;
          margin: 2em 0;
          font-style: italic;
          color: var(--foreground-secondary);
          background: var(--foreground-border);
          padding: 1.5rem;
          border-radius: 0 0.5rem 0.5rem 0;
        }

        .prose blockquote p {
          margin: 0;
        }

        .prose code {
          background: var(--foreground-border);
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875em;
          color: var(--foreground);
          border: 1px solid var(--foreground-border);
        }

        .prose pre {
          background: var(--foreground-border);
          padding: 1.5rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          margin: 2em 0;
          border: 1px solid var(--foreground-border);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .prose pre code {
          background: transparent;
          padding: 0;
          border: none;
          font-size: 0.875rem;
          line-height: 1.7;
        }

        .prose img {
          border-radius: 0.75rem;
          margin: 2em 0;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          max-width: 100%;
          height: auto;
        }

        .prose hr {
          border: none;
          border-top: 2px solid var(--foreground-border);
          margin: 3em 0;
        }

        .prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 2em 0;
        }

        .prose th,
        .prose td {
          border: 1px solid var(--foreground-border);
          padding: 0.75rem 1rem;
          text-align: left;
        }

        .prose th {
          background: var(--foreground-border);
          font-weight: 600;
        }

        /* Reading Experience Enhancements */
        @media (max-width: 640px) {
          .prose {
            font-size: 1rem;
          }
          
          .prose h1 {
            font-size: 1.75rem;
          }
          
          .prose h2 {
            font-size: 1.5rem;
          }
          
          .prose h3 {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}