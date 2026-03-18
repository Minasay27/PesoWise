import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, LogOut, Calendar } from 'lucide-react';
import { getCurrentUser, getUserProfile, updateUserProfile, updatePassword, signOut } from '../utils/supabase';

export default function Profile({ onLogout }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    phone: ''
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      const userProfile = await getUserProfile(currentUser.id);
      setProfile(userProfile);
      setFormData({
        full_name: userProfile.full_name || '',
        phone: userProfile.phone || ''
      });
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await updateUserProfile(user.id, formData);
      setSuccess('Profile updated successfully!');
      setEditing(false);
      await loadUserData();
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSaving(true);

    try {
      await updatePassword(passwordData.newPassword);
      setSuccess('Password changed successfully!');
      setChangingPassword(false);
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await signOut();
        onLogout();
      } catch (err) {
        setError('Failed to logout');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-soft">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-dusty-rose border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-rose rounded-2xl shadow-float mb-4">
            <User size={40} className="text-wine" />
          </div>
          <h1 className="text-3xl font-bold text-wine mb-2">Profile Settings</h1>
          <p className="text-wine/70">Manage your account information</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-100/50 backdrop-blur-sm border border-red-200/60 rounded-2xl text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100/50 backdrop-blur-sm border border-green-200/60 rounded-2xl text-green-700">
            {success}
          </div>
        )}

        {/* Account Status */}
        <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-glass-lg p-6 border border-white/60 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-wine mb-2 flex items-center gap-2">
                <span>✨</span> Account Status
              </h2>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-rose text-wine border border-white/40 backdrop-blur-sm shadow-glass">
                <span>🎉</span>
                <span className="font-bold">FREE - All Features Unlocked</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-wine/70 mt-4 flex items-center gap-2">
            <Calendar size={16} />
            Member since: {new Date(profile?.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Profile Information */}
        <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-glass-lg p-6 border border-white/60 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-wine flex items-center gap-2">
              <User size={24} />
              Profile Information
            </h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-dusty-rose/30 text-wine rounded-xl font-semibold hover:bg-dusty-rose/50 transition-all"
              >
                ✏️ Edit
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-wine mb-2 flex items-center gap-2">
                  <User size={16} />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl focus:ring-2 focus:ring-dusty-rose/50 text-wine"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-wine mb-2 flex items-center gap-2">
                  <Mail size={16} />
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full px-4 py-3 bg-white/30 border border-white/40 rounded-2xl text-wine/60 cursor-not-allowed"
                />
                <p className="text-xs text-wine/60 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-wine mb-2 flex items-center gap-2">
                  <Phone size={16} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+63 XXX XXX XXXX"
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl focus:ring-2 focus:ring-dusty-rose/50 text-wine"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-rose text-wine py-3 rounded-2xl font-bold hover:shadow-float transition-all disabled:opacity-50"
                >
                  {saving ? '💾 Saving...' : '💾 Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      full_name: profile.full_name || '',
                      phone: profile.phone || ''
                    });
                  }}
                  className="px-6 py-3 bg-white/50 text-wine rounded-2xl font-semibold hover:bg-white/70 transition-all"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-wine/70 mb-1 flex items-center gap-2">
                  <User size={16} />
                  Full Name
                </p>
                <p className="text-lg font-semibold text-wine">{profile?.full_name || 'Not set'}</p>
              </div>

              <div>
                <p className="text-sm text-wine/70 mb-1 flex items-center gap-2">
                  <Mail size={16} />
                  Email Address
                </p>
                <p className="text-lg font-semibold text-wine">{user?.email}</p>
              </div>

              <div>
                <p className="text-sm text-wine/70 mb-1 flex items-center gap-2">
                  <Phone size={16} />
                  Phone Number
                </p>
                <p className="text-lg font-semibold text-wine">{profile?.phone || 'Not set'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Change Password */}
        <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-glass-lg p-6 border border-white/60 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-wine flex items-center gap-2">
              <Lock size={24} />
              Change Password
            </h2>
            {!changingPassword && (
              <button
                onClick={() => setChangingPassword(true)}
                className="px-4 py-2 bg-dusty-rose/30 text-wine rounded-xl font-semibold hover:bg-dusty-rose/50 transition-all"
              >
                🔑 Change
              </button>
            )}
          </div>

          {changingPassword ? (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-wine mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl focus:ring-2 focus:ring-dusty-rose/50 text-wine"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-wine mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Re-enter new password"
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl focus:ring-2 focus:ring-dusty-rose/50 text-wine"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-rose text-wine py-3 rounded-2xl font-bold hover:shadow-float transition-all disabled:opacity-50"
                >
                  {saving ? '🔐 Changing...' : '🔐 Change Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setChangingPassword(false);
                    setPasswordData({ newPassword: '', confirmPassword: '' });
                  }}
                  className="px-6 py-3 bg-white/50 text-wine rounded-2xl font-semibold hover:bg-white/70 transition-all"
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          ) : (
            <p className="text-wine/70">
              Your password was last changed on{' '}
              {new Date(profile?.updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          )}
        </div>

        {/* Logout */}
        <div className="text-center">
          <button
            onClick={handleLogout}
            className="px-8 py-4 bg-red-100/50 backdrop-blur-sm text-red-700 rounded-2xl font-bold hover:bg-red-200/50 transition-all shadow-glass border border-red-200/60 flex items-center gap-2 mx-auto"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
