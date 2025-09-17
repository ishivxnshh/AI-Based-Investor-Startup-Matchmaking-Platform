import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast, ToastMessages } from '../components/Toast';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email: email.trim().toLowerCase(),
        password
      });

      const user = response.data;
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      toast.success(ToastMessages.LOGIN_SUCCESS);
      
      if (!user.hasFilledForm) {
        navigate(user.role === 'startup' ? '/startup-form' : '/investor-form');
      } else {
        navigate(user.role === 'startup' ? '/startup-dashboard' : '/investor-dashboard');
      }
    } catch (err) {
      let errorMessage = ToastMessages.LOGIN_ERROR;
      
      if (err.response) {
        switch (err.response.status) {
          case 401:
            errorMessage = 'Invalid email or password!';
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
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <AuthLayout>
      <div className="transition duration-300">
        <h2 className='text-2xl font-semibold mb-6'>Login</h2>

        {error && (
          <div className='mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm'>
            {error}
          </div>
        )}

        <form onSubmit={onSubmitHandler} className='flex flex-col gap-4 mb-4'>
          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
              Email Address
            </label>
            <input
              id='email'
              name='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email'
              className='w-full p-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 bg-white'
              required
            />
          </div>

          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>
              Password
            </label>
            <div className="relative">
              <input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter your password'
                className='w-full p-2 pr-10 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 bg-white'
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button 
            type='submit' 
            className='btn-primary w-full focus-ring'
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner size="small" text="Logging in..." />
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Login
              </span>
            )}
          </button>
        </form>

        <div className='text-sm text-center text-gray-600'>
          Don't have an account?{' '}
          <span
            className='text-violet-500 cursor-pointer font-medium'
            onClick={() => navigate('/register')}
          >
            Sign up
          </span>
        </div>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;