import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();

  const from = location.state?.from || '/account';
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (mode === 'signup' && formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login({ email: formData.email, password: formData.password });
      } else {
        await signup({
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name
        });
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 md:pt-40 pb-section-gap min-h-screen flex items-center justify-center px-margin-mobile">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link to="/" className="font-headline-md text-headline-md tracking-widest text-on-surface">
            GLOW BEAUTY
          </Link>
          <p className="text-on-surface-variant font-body-md mt-2">
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-outline-variant mb-8">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-3 font-label-caps text-label-caps tracking-widest transition-colors ${mode === 'login' ? 'border-b-2 border-on-surface text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            SIGN IN
          </button>
          <button
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-3 font-label-caps text-label-caps tracking-widest transition-colors ${mode === 'signup' ? 'border-b-2 border-on-surface text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            CREATE ACCOUNT
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-xs text-on-surface-variant tracking-wider">FIRST NAME</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required={mode === 'signup'}
                  placeholder="Jane"
                  className="bg-transparent border-b border-outline py-2 font-body-md focus:border-on-surface focus:ring-0 placeholder:text-on-surface-variant/50 outline-none transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-label-caps text-xs text-on-surface-variant tracking-wider">LAST NAME</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required={mode === 'signup'}
                  placeholder="Doe"
                  className="bg-transparent border-b border-outline py-2 font-body-md focus:border-on-surface focus:ring-0 placeholder:text-on-surface-variant/50 outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-xs text-on-surface-variant tracking-wider">EMAIL ADDRESS</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="jane@example.com"
              autoComplete="email"
              className="bg-transparent border-b border-outline py-2 font-body-md focus:border-on-surface focus:ring-0 placeholder:text-on-surface-variant/50 outline-none transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-label-caps text-xs text-on-surface-variant tracking-wider">PASSWORD</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder={mode === 'signup' ? 'Min. 8 characters' : '••••••••'}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="bg-transparent border-b border-outline py-2 font-body-md focus:border-on-surface focus:ring-0 placeholder:text-on-surface-variant/50 outline-none transition-colors"
            />
          </div>

          {mode === 'signup' && (
            <div className="flex flex-col gap-1">
              <label className="font-label-caps text-xs text-on-surface-variant tracking-wider">CONFIRM PASSWORD</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Re-enter your password"
                autoComplete="new-password"
                className="bg-transparent border-b border-outline py-2 font-body-md focus:border-on-surface focus:ring-0 placeholder:text-on-surface-variant/50 outline-none transition-colors"
              />
            </div>
          )}

          {error && (
            <div className="bg-error/10 border border-error/30 text-error px-4 py-3 text-sm font-body-md rounded-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-on-surface text-surface py-4 font-label-caps text-label-caps tracking-widest uppercase hover:bg-secondary transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {loading && (
              <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
            )}
            {loading ? 'PLEASE WAIT...' : (mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT')}
          </button>

          {mode === 'login' && (
            <p className="text-center text-on-surface-variant font-body-md text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); }}
                className="text-on-surface underline hover:text-primary transition-colors"
              >
                Create one
              </button>
            </p>
          )}

          {mode === 'signup' && (
            <p className="text-center text-on-surface-variant font-body-md text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className="text-on-surface underline hover:text-primary transition-colors"
              >
                Sign in
              </button>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
