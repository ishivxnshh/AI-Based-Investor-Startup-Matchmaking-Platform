import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      
      // Redirect based on role and form status
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

  return (
    <AuthLayout>
      <h2 className='text-2xl font-semibold'>Login</h2>

      {error && (
        <div className='mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm'>
          {error}
        </div>
      )}

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
        <input
          name='email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email Address'
          className='p-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 bg-white'
          required
        />
        <input
          name='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
          className='p-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-500 bg-white'
          required
        />

        <button 
          type='submit' 
          className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md flex justify-center items-center'
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

      <div className='text-sm text-gray-300 mt-2'>
        <p>
          Don't have an account?{' '}
          <span
            className='text-violet-400 cursor-pointer underline'
            onClick={() => navigate('/Register')}
          >
            Sign up
          </span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;