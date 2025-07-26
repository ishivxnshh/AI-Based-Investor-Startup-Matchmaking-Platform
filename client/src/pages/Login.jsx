import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // Hardcoded Google Client ID
  const GOOGLE_CLIENT_ID = '234645810155-l657kinkpo3nv1hq21v8ug3120fl968d.apps.googleusercontent.com';

  useEffect(() => {
    // Load Google SDK
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGoogleLoaded(true);
      initializeGoogleSignIn();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeGoogleSignIn = () => {
    if (!window.google) {
      setTimeout(initializeGoogleSignIn, 100);
      return;
    }

    const container = document.getElementById('googleSignInContainer');
    if (!container) {
      setTimeout(initializeGoogleSignIn, 100);
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse
      });
      
      window.google.accounts.id.renderButton(
        container,
        { 
          theme: 'outline', 
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          width: '100%'
        }
      );
    } catch (err) {
      console.error('Google Sign-In initialization error:', err);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password
      });

      const user = response.data;
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      if (!user.hasFilledForm) {
        navigate(user.role === 'startup' ? '/startup-form' : '/investor-form');
      } else {
        navigate(user.role === 'startup' ? '/startup-dashboard' : '/investor-dashboard');
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setError('Invalid email or password!');
        } else {
          setError('Login failed. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleResponse = async (response) => {
    setIsLoading(true);
    setError('');

    try {
      const authResponse = await axios.post('http://localhost:5000/api/google-auth', {
        token: response.credential
      });

      const user = authResponse.data;
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      if (!user.hasFilledForm) {
        navigate(user.role === 'startup' ? '/startup-form' : '/investor-form');
      } else {
        navigate(user.role === 'startup' ? '/startup-dashboard' : '/investor-dashboard');
      }
    } catch (err) {
      setError('Google authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
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
          <input
            id='password'
            name='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter your password'
            className='w-full p-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 bg-white'
            required
          />
        </div>

        <button 
          type='submit' 
          className='w-full py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md flex justify-center items-center'
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* Google Sign-In Button */}
      <div id="googleSignInContainer" className="w-full"></div>

      <div className='text-sm text-center text-gray-600'>
        Don't have an account?{' '}
        <span
          className='text-violet-500 cursor-pointer font-medium'
          onClick={() => navigate('/register')}
        >
          Sign up
        </span>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;