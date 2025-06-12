import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const isDevelopment = import.meta.env.DEV;

  const getErrorMessage = (error) => {
    if (error.message === 'Invalid login credentials') {
      return 'Invalid email or password. Please double-check your credentials and try again. If you don\'t have an account yet, please sign up first.';
    }
    if (error.message === 'User already registered') {
      return 'An account with this email already exists. Please sign in instead or use a different email address.';
    }
    if (error.message === 'Email not confirmed') {
      return 'Please check your email and click the confirmation link before signing in.';
    }
    if (error.message === 'Signup not allowed for this instance') {
      return 'Account registration is currently disabled. Please contact support.';
    }
    return error.message;
  };

  const handleDevBypass = () => {
    // Create a mock user session for development
    const mockUser = {
      id: 'dev-user-123',
      email: 'dev@example.com',
      user_metadata: {},
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Store mock session in localStorage for persistence
    localStorage.setItem('dev-mock-user', JSON.stringify(mockUser));
    
    onAuthSuccess();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        
        if (error) throw error;
        
        setMessage('Password reset email sent! Please check your inbox and follow the instructions to reset your password.');
        setEmail('');
      } else if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (data.user) {
          onAuthSuccess();
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (data.user) {
          if (data.user.email_confirmed_at) {
            onAuthSuccess();
          } else {
            setMessage('Account created successfully! Please check your email for a confirmation link.');
          }
        }
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setError(null);
    setMessage(null);
    setEmail('');
    setPassword('');
  };

  const handleModeChange = (newMode) => {
    resetForm();
    if (newMode === 'forgot') {
      setIsForgotPassword(true);
      setIsLogin(false);
    } else if (newMode === 'login') {
      setIsForgotPassword(false);
      setIsLogin(true);
    } else if (newMode === 'signup') {
      setIsForgotPassword(false);
      setIsLogin(false);
    }
  };

  const getTitle = () => {
    if (isForgotPassword) return 'Reset your password';
    return isLogin ? 'Sign in to your account' : 'Create your account';
  };

  const getButtonText = () => {
    if (loading) return 'Loading...';
    if (isForgotPassword) return 'Send reset email';
    return isLogin ? 'Sign in' : 'Sign up';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {getTitle()}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome to LighthouseHQ
          </p>
        </div>

        {/* Development bypass button */}
        {isDevelopment && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <div className="text-sm text-yellow-800">
                  <strong>Development Mode:</strong> Skip authentication for testing
                </div>
              </div>
            </div>
            <div className="mt-3">
              <button
                onClick={handleDevBypass}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Skip Login (Dev Only)
              </button>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <div className="text-red-800 text-sm">{error}</div>
                </div>
              </div>
            </div>
          )}

          {message && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <div className="text-green-800 text-sm">{message}</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${
                  isForgotPassword ? 'rounded-md' : 'rounded-t-md'
                }`}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {!isForgotPassword && (
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
          </div>

          {isLogin && !isForgotPassword && (
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => handleModeChange('forgot')}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </button>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {getButtonText()}
            </button>
          </div>

          <div className="text-center space-y-2">
            {isForgotPassword ? (
              <button
                type="button"
                onClick={() => handleModeChange('login')}
                className="text-blue-600 hover:text-blue-500 text-sm"
              >
                Back to sign in
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleModeChange(isLogin ? 'signup' : 'login')}
                className="text-blue-600 hover:text-blue-500 text-sm"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;