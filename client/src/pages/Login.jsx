import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { useToast, ToastMessages } from '../components/Toast';
import useApi from '../hooks/useApi';
import { Button, Input, Alert } from '../components/ui';

const LoginPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { post, loading } = useApi();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Clear error when user starts typing
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    // Clear error only when starting a valid submission
    setError('');

    try {
      const response = await post('/auth/login', {
        email: email.trim().toLowerCase(),
        password
      }, {
        showSuccess: true,
        successMessage: ToastMessages.LOGIN_SUCCESS,
        showError: false,
        // Disable auto-redirect for login attempts
        disableAutoRedirect: true
      });

      // Store the user data and token
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      
      if (!response.user.hasFilledForm) {
        navigate(response.user.role === 'startup' ? '/startup-form' : '/investor-form');
      } else {
        navigate(response.user.role === 'startup' ? '/startup-dashboard' : '/investor-dashboard');
      }
    } catch (err) {
      // Prevent any navigation or reload on error
      e.preventDefault();
      
      let errorMessage = ToastMessages.LOGIN_ERROR;
      
      if (err.response) {
        switch (err.response.status) {
          case 401:
            errorMessage = 'Invalid email or password. Please check your credentials and try again.';
            break;
          case 429:
            errorMessage = 'Too many login attempts. Please try again later.';
            break;
          case 500:
            errorMessage = ToastMessages.SERVER_ERROR;
            break;
          default:
            errorMessage = 'Login failed. Please try again.';
        }
      } else if (err.code === 'NETWORK_ERROR' || !navigator.onLine) {
        errorMessage = ToastMessages.NETWORK_ERROR;
      }
      
      // Set error state first
      setError(errorMessage);
      
      // Show toast notification
      setTimeout(() => {
        toast.error(errorMessage);
      }, 100);
      
      // Don't clear the form fields on error - let user correct them
      console.error('Login error:', err);
      
      // Ensure we stay on the page
      return false;
    }
  };


  const emailIcon = (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
    </svg>
  );

  const lockIcon = (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  const loginIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
  );

  return (
    <AuthLayout>
      <div className="transition duration-300 animate-scale-in">
        <div className="text-center mb-8">
          <h2 className='text-3xl font-bold mb-2 text-gradient'>Welcome Back</h2>
          <p className="text-gray-300 text-sm">Sign in to continue your journey</p>
        </div>

        {error && (
          <Alert variant="error" className="mb-6" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 mb-6' autoComplete="off">
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="you@example.com"
            icon={emailIcon}
            autoComplete="off"
            required
          />

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your password"
            icon={lockIcon}
            autoComplete="new-password"
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="hover:text-purple-400 transition-colors"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            }
            required
          />

          <Button 
            type="submit" 
            fullWidth
            loading={loading}
            icon={!loading && loginIcon}
            className="mt-2"
          >
            Sign In
          </Button>
        </form>

        <div className="divider"></div>

        <div className='text-sm text-center text-gray-300'>
          Don't have an account?{' '}
          <span
            className='text-purple-400 cursor-pointer font-semibold hover:text-purple-300 transition-colors'
            onClick={() => navigate('/register')}
          >
            Create Account →
          </span>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;