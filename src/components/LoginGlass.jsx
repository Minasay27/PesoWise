import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { signUp, signIn, resetPassword, resendVerificationEmail } from '../utils/supabase';

export default function LoginGlass({ onLoginSuccess }) {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.includes('@gmail.com')) {
      setError('Please use a valid Gmail address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, fullName);
      setSuccess('Account created! Please check your email to verify your account.');
      setMode('verify');
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { user } = await signIn(email, password);
      
      if (!user.email_confirmed_at) {
        setError('Please verify your email first. Check your inbox.');
        setMode('verify');
        return;
      }

      onLoginSuccess(user);
    } catch (err) {
      if (err.message.includes('Invalid login credentials')) {
        setError('Invalid email or password');
      } else {
        setError(err.message || 'Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await resendVerificationEmail();
      setSuccess('Verification email sent! Check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to resend verification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft relative overflow-hidden flex items-center justify-center p-4">
      {/* Floating Background Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blush/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-muted-mauve/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-dusty-rose/20 rounded-full blur-3xl animate-pulse-soft"></div>

      {/* Main Container */}
      <div className="max-w-md w-full relative z-10">
        {/* Glass Card */}
        <div className="bg-white/40 backdrop-blur-xl rounded-3xl shadow-glass-lg p-8 border border-white/60">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-rose rounded-2xl shadow-float mb-4 animate-float">
              <span className="text-5xl">💰</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-mauve bg-clip-text text-transparent mb-2">
              PesoWise
            </h1>
            <p className="text-wine/80 text-sm font-medium">
              Smart Expense Tracking for Filipinos
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-100/50 backdrop-blur-sm border border-red-200/60 rounded-2xl flex items-center gap-3 shadow-glass">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
              <span className="text-sm text-red-700 font-medium">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-100/50 backdrop-blur-sm border border-green-200/60 rounded-2xl flex items-center gap-3 shadow-glass">
              <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
              <span className="text-sm text-green-700 font-medium">{success}</span>
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleSignIn} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-wine mb-2 flex items-center gap-2">
                  <span>📧</span> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-5 py-4 bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl focus:ring-2 focus:ring-dusty-rose/50 focus:border-dusty-rose transition-all shadow-inner-glass text-wine placeholder-wine/40"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-wine mb-2 flex items-center gap-2">
                  <span>🔐</span> Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-5 py-4 bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl focus:ring-2 focus:ring-dusty-rose/50 focus:border-dusty-rose transition-all shadow-inner-glass text-wine placeholder-wine/40"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-mauve hover:text-wine transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-rose text-wine py-4 rounded-2xl font-bold text-lg hover:shadow-float transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glass border border-white/40"
              >
                {loading ? '✨ Signing in...' : '🚀 Sign In'}
              </button>

              <div className="text-center space-y-3">
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="text-sm text-muted-mauve hover:text-wine font-medium transition-colors"
                >
                  🔑 Forgot password?
                </button>
                <div className="text-sm text-wine/70">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="text-wine font-bold hover:text-burgundy transition-colors"
                  >
                    Sign up ✨
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Sign Up Form */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-wine mb-2 flex items-center gap-2">
                  <span>👤</span> Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Juan Dela Cruz"
                  className="w-full px-5 py-4 bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl focus:ring-2 focus:ring-dusty-rose/50 focus:border-dusty-rose transition-all shadow-inner-glass text-wine placeholder-wine/40"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-wine mb-2 flex items-center gap-2">
                  <span>📧</span> Gmail Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-5 py-4 bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl focus:ring-2 focus:ring-dusty-rose/50 focus:border-dusty-rose transition-all shadow-inner-glass text-wine placeholder-wine/40"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-wine mb-2 flex items-center gap-2">
                  <span>🔐</span> Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-5 py-4 bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl focus:ring-2 focus:ring-dusty-rose/50 focus:border-dusty-rose transition-all shadow-inner-glass text-wine placeholder-wine/40"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-mauve hover:text-wine transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-wine mb-2 flex items-center gap-2">
                  <span>✅</span> Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-5 py-4 bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl focus:ring-2 focus:ring-dusty-rose/50 focus:border-dusty-rose transition-all shadow-inner-glass text-wine placeholder-wine/40"
                  required
                />
              </div>

              <div className="bg-blush/30 backdrop-blur-sm border border-blush/50 rounded-2xl p-4 shadow-glass">
                <p className="font-bold text-wine mb-1 flex items-center gap-2">
                  <span>🎉</span> Completely FREE!
                </p>
                <p className="text-sm text-wine/80">
                  All features included at no cost. Track unlimited transactions and enjoy full access to PesoWise!
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-rose text-wine py-4 rounded-2xl font-bold text-lg hover:shadow-float transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glass border border-white/40"
              >
                {loading ? '✨ Creating account...' : '🚀 Create Free Account'}
              </button>

              <div className="text-center text-sm text-wine/70">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-wine font-bold hover:text-burgundy transition-colors"
                >
                  Sign in 🔑
                </button>
              </div>
            </form>
          )}

          {/* Reset Password Form */}
          {mode === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <p className="text-sm text-wine/80 mb-4 flex items-center gap-2">
                <span>💌</span>
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <div>
                <label className="block text-sm font-semibold text-wine mb-2 flex items-center gap-2">
                  <span>📧</span> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-5 py-4 bg-white/50 backdrop-blur-sm border border-white/60 rounded-2xl focus:ring-2 focus:ring-dusty-rose/50 focus:border-dusty-rose transition-all shadow-inner-glass text-wine placeholder-wine/40"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-rose text-wine py-4 rounded-2xl font-bold text-lg hover:shadow-float transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-glass border border-white/40"
              >
                {loading ? '📨 Sending...' : '📬 Send Reset Link'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-sm text-muted-mauve hover:text-wine font-medium transition-colors"
                >
                  ← Back to login
                </button>
              </div>
            </form>
          )}

          {/* Verification Screen */}
          {mode === 'verify' && (
            <div className="text-center space-y-5">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-rose rounded-2xl shadow-float animate-bounce">
                <span className="text-5xl">📧</span>
              </div>
              <h3 className="text-2xl font-bold text-wine">Verify Your Email</h3>
              <p className="text-wine/80">
                We've sent a verification link to <strong className="text-burgundy">{email}</strong>
              </p>
              <p className="text-sm text-wine/60 flex items-center justify-center gap-2">
                <span>✨</span>
                Click the link in the email to verify your account and start using PesoWise.
              </p>

              <button
                onClick={handleResendVerification}
                disabled={loading}
                className="w-full bg-white/50 backdrop-blur-sm text-wine py-4 rounded-2xl font-semibold hover:bg-white/70 transition-all disabled:opacity-50 shadow-glass border border-white/60"
              >
                {loading ? '📨 Sending...' : '🔄 Resend Verification Email'}
              </button>

              <button
                onClick={() => setMode('login')}
                className="w-full text-muted-mauve hover:text-wine text-sm font-medium transition-colors"
              >
                ← Back to login
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <div className="inline-block bg-white/40 backdrop-blur-xl rounded-full px-6 py-3 border border-white/60 shadow-glass">
            <p className="text-xs text-wine/70 font-medium flex items-center gap-2">
              <span>🔒</span>
              Your data is secured with bank-level encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
