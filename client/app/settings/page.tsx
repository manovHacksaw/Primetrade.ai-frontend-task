'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import ConfirmationModal from '@/components/ConfirmationModal';
import api from '@/lib/axios';
import { isAuthenticated, removeToken } from '@/lib/auth';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ username?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Username state
  const [newUsername, setNewUsername] = useState('');
  const [usernamePassword, setUsernamePassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<{
    current?: string;
    new?: string;
    confirm?: string;
    general?: string;
  }>({});
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    fetchUserInfo();
  }, [router]);

  const fetchUserInfo = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
      setNewUsername(response.data.username || '');
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameSubmit = async () => {
    setShowUsernameModal(false);
    setUsernameError('');
    
    if (!newUsername.trim()) {
      setUsernameError('Username cannot be empty');
      return;
    }

    if (!usernamePassword) {
      setUsernameError('Password is required to confirm changes');
      return;
    }

    setUsernameLoading(true);
    try {
      const response = await api.patch('/user/username', { 
        newUsername: newUsername.trim(),
        password: usernamePassword,
      });
      setUser(response.data.user);
      setUsernameError('');
      setUsernamePassword('');
      // Reset form
      setNewUsername(response.data.user.username);
    } catch (error: any) {
      setUsernameError(error.response?.data?.message || 'Failed to update username');
      setUsernamePassword('');
    } finally {
      setUsernameLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    setShowPasswordModal(false);
    setPasswordErrors({});

    // Validation
    const errors: { current?: string; new?: string; confirm?: string } = {};
    
    if (!currentPassword) {
      errors.current = 'Current password is required';
    }
    
    if (!newPassword) {
      errors.new = 'New password is required';
    } else if (newPassword.length < 6) {
      errors.new = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      errors.confirm = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      errors.confirm = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setPasswordLoading(true);
    try {
      await api.patch('/user/password', {
        currentPassword,
        newPassword,
      });
      
      // Success - logout and redirect
      removeToken();
      router.push('/login');
    } catch (error: any) {
      setPasswordErrors({
        general: error.response?.data?.message || 'Failed to update password',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: 'center', color: 'var(--foreground-muted)' }}>Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: 'var(--foreground)',
          marginBottom: '3rem',
          letterSpacing: '-0.02em',
        }}
      >
        Account Settings
      </motion.h1>

      {/* Change Username Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          marginBottom: '4rem',
        }}
      >
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: 'var(--foreground)',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--foreground-border)',
        }}>
          Change Username
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Validate before showing modal
            if (!newUsername.trim() || newUsername.trim() === user?.username) {
              return;
            }
            if (!usernamePassword) {
              setUsernameError('Password is required to confirm changes');
              return;
            }
            setShowUsernameModal(true);
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="username" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 400,
              color: 'var(--foreground-muted)',
              marginBottom: '0.75rem',
            }}>
              New Username
            </label>
            <input
              id="username"
              type="text"
              value={newUsername}
              onChange={(e) => {
                setNewUsername(e.target.value);
                setUsernameError('');
              }}
              placeholder="Enter new username"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--background)',
                border: `1px solid ${usernameError ? '#ef4444' : 'var(--foreground-border)'}`,
                borderRadius: '0.5rem',
                outline: 'none',
                color: 'var(--foreground)',
                fontSize: '0.875rem',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                if (!usernameError) {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.boxShadow = `0 0 0 2px var(--accent)33`;
                }
              }}
              onBlur={(e) => {
                if (!usernameError) {
                  e.currentTarget.style.borderColor = 'var(--foreground-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
              className="sm:text-base"
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="usernamePassword" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 400,
              color: 'var(--foreground-muted)',
              marginBottom: '0.75rem',
            }}>
              Confirm Password
            </label>
            <input
              id="usernamePassword"
              type="password"
              value={usernamePassword}
              onChange={(e) => {
                setUsernamePassword(e.target.value);
                setUsernameError('');
              }}
              placeholder="Enter your password to confirm"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--background)',
                border: `1px solid ${usernameError ? '#ef4444' : 'var(--foreground-border)'}`,
                borderRadius: '0.5rem',
                outline: 'none',
                color: 'var(--foreground)',
                fontSize: '0.875rem',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                if (!usernameError) {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.boxShadow = `0 0 0 2px var(--accent)33`;
                }
              }}
              onBlur={(e) => {
                if (!usernameError) {
                  e.currentTarget.style.borderColor = 'var(--foreground-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
              className="sm:text-base"
            />
            <AnimatePresence>
              {usernameError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}
                >
                  {usernameError}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <motion.button
              type="submit"
              disabled={usernameLoading || !newUsername.trim() || newUsername.trim() === user?.username || !usernamePassword}
              whileHover={{ scale: usernameLoading || !newUsername.trim() || newUsername.trim() === user?.username || !usernamePassword ? 1 : 1.02 }}
              whileTap={{ scale: usernameLoading || !newUsername.trim() || newUsername.trim() === user?.username || !usernamePassword ? 1 : 0.98 }}
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: 'var(--foreground-border)',
                color: 'var(--foreground)',
                borderRadius: '0.5rem',
                fontWeight: 500,
                fontSize: '0.875rem',
              opacity: usernameLoading || !newUsername.trim() || newUsername.trim() === user?.username || !usernamePassword ? 0.5 : 1,
              cursor: usernameLoading || !newUsername.trim() || newUsername.trim() === user?.username || !usernamePassword ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                border: '1px solid var(--foreground-border)',
              }}
              onMouseEnter={(e) => {
                if (!usernameLoading && newUsername.trim() && newUsername.trim() !== user?.username && usernamePassword) {
                  e.currentTarget.style.backgroundColor = 'var(--foreground-secondary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!usernameLoading && newUsername.trim() && newUsername.trim() !== user?.username && usernamePassword) {
                  e.currentTarget.style.backgroundColor = 'var(--foreground-border)';
                }
              }}
            >
              {usernameLoading ? 'Updating...' : 'Update Username'}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Change Password Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          color: 'var(--foreground)',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--foreground-border)',
        }}>
          Change Password
        </h2>
        <AnimatePresence>
          {passwordErrors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                marginBottom: '1.5rem',
                padding: '0.75rem',
                backgroundColor: 'var(--background)',
                border: '1px solid #ef4444',
                borderRadius: '0.5rem',
                color: '#ef4444',
                fontSize: '0.875rem',
              }}
            >
              {passwordErrors.general}
            </motion.div>
          )}
        </AnimatePresence>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Validate before showing modal
            const errors: { current?: string; new?: string; confirm?: string } = {};
            if (!currentPassword) errors.current = 'Current password is required';
            if (!newPassword) errors.new = 'New password is required';
            if (!confirmPassword) errors.confirm = 'Please confirm your new password';
            if (newPassword && confirmPassword && newPassword !== confirmPassword) {
              errors.confirm = 'Passwords do not match';
            }
            
            if (Object.keys(errors).length === 0) {
              setShowPasswordModal(true);
            } else {
              setPasswordErrors(errors);
            }
          }}
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="currentPassword" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 400,
              color: 'var(--foreground-muted)',
              marginBottom: '0.75rem',
            }}>
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                setPasswordErrors({ ...passwordErrors, current: undefined });
              }}
              placeholder="Enter current password"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--background)',
                border: `1px solid ${passwordErrors.current ? '#ef4444' : 'var(--foreground-border)'}`,
                borderRadius: '0.5rem',
                outline: 'none',
                color: 'var(--foreground)',
                fontSize: '0.875rem',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                if (!passwordErrors.current) {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.boxShadow = `0 0 0 2px var(--accent)33`;
                }
              }}
              onBlur={(e) => {
                if (!passwordErrors.current) {
                  e.currentTarget.style.borderColor = 'var(--foreground-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
              className="sm:text-base"
            />
            <AnimatePresence>
              {passwordErrors.current && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}
                >
                  {passwordErrors.current}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="newPassword" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 400,
              color: 'var(--foreground-muted)',
              marginBottom: '0.75rem',
            }}>
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordErrors({ ...passwordErrors, new: undefined, confirm: undefined });
              }}
              placeholder="Enter new password"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--background)',
                border: `1px solid ${passwordErrors.new ? '#ef4444' : 'var(--foreground-border)'}`,
                borderRadius: '0.5rem',
                outline: 'none',
                color: 'var(--foreground)',
                fontSize: '0.875rem',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                if (!passwordErrors.new) {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.boxShadow = `0 0 0 2px var(--accent)33`;
                }
              }}
              onBlur={(e) => {
                if (!passwordErrors.new) {
                  e.currentTarget.style.borderColor = 'var(--foreground-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
              className="sm:text-base"
            />
            <AnimatePresence>
              {passwordErrors.new && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}
                >
                  {passwordErrors.new}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="confirmPassword" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 400,
              color: 'var(--foreground-muted)',
              marginBottom: '0.75rem',
            }}>
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordErrors({ ...passwordErrors, confirm: undefined });
              }}
              placeholder="Confirm new password"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--background)',
                border: `1px solid ${passwordErrors.confirm ? '#ef4444' : 'var(--foreground-border)'}`,
                borderRadius: '0.5rem',
                outline: 'none',
                color: 'var(--foreground)',
                fontSize: '0.875rem',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                if (!passwordErrors.confirm) {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.boxShadow = `0 0 0 2px var(--accent)33`;
                }
              }}
              onBlur={(e) => {
                if (!passwordErrors.confirm) {
                  e.currentTarget.style.borderColor = 'var(--foreground-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
              className="sm:text-base"
            />
            <AnimatePresence>
              {passwordErrors.confirm && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#ef4444' }}
                >
                  {passwordErrors.confirm}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <motion.button
              type="submit"
              disabled={passwordLoading}
              whileHover={{ scale: passwordLoading ? 1 : 1.02 }}
              whileTap={{ scale: passwordLoading ? 1 : 0.98 }}
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: 'var(--foreground-border)',
                color: 'var(--foreground)',
                borderRadius: '0.5rem',
                fontWeight: 500,
                fontSize: '0.875rem',
                opacity: passwordLoading ? 0.5 : 1,
                cursor: passwordLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                border: '1px solid var(--foreground-border)',
              }}
              onMouseEnter={(e) => {
                if (!passwordLoading) {
                  e.currentTarget.style.backgroundColor = 'var(--foreground-secondary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!passwordLoading) {
                  e.currentTarget.style.backgroundColor = 'var(--foreground-border)';
                }
              }}
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Username Confirmation Modal */}
      <ConfirmationModal
        isOpen={showUsernameModal}
        onClose={() => setShowUsernameModal(false)}
        onConfirm={handleUsernameSubmit}
        title="Change Username"
        message="Are you sure you want to change your username?"
        confirmText="Yes, Change Username"
        cancelText="Cancel"
      />

      {/* Password Confirmation Modal */}
      <ConfirmationModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onConfirm={handlePasswordSubmit}
        title="Change Password"
        message="Changing your password will require re-login. Continue?"
        confirmText="Yes, Change Password"
        cancelText="Cancel"
      />
    </DashboardLayout>
  );
}
