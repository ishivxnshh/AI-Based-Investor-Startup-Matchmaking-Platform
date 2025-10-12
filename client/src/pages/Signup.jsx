import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import useApi from '../hooks/useApi';
import { Button, Input, Alert, Badge } from '../components/ui';

const Register = () => {
  const navigate = useNavigate();
  const { post, loading, error } = useApi();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.fullName || !formData.email || !formData.password || !formData.role) {
      setLocalError('Please fill in all fields');
      return;
    }

    try {
      const response = await post('/auth/register', formData, {
        showSuccess: true,
        successMessage: 'Account created successfully!',
        showError: false
      });
      
      // Store the user data and token
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      
      navigate(formData.role === 'startup' ? '/startup-form' : '/investor-form');
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response?.status === 409) {
        setLocalError('Email already registered. Please use a different email or try logging in.');
      } else if (err.response?.data?.error) {
        setLocalError(err.response.data.error);
      } else {
        setLocalError('Registration failed. Please try again.');
      }
    }
  };

  const userIcon = (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const emailIcon = (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
    </svg>
  );

  const lockIcon = (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  return (
    <AuthLayout>
      <div className="animate-scale-in">
        <div className="text-center mb-8">
          <h2 className='text-3xl font-bold mb-2 text-gradient'>Create Account</h2>
          <p className="text-gray-300 text-sm">Join VentureBridge and start your journey</p>
        </div>

        {(error || localError) && (
          <Alert variant="error" className="mb-6" onClose={() => setLocalError('')}>
            {localError || error}
          </Alert>
        )}

        <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 mb-6' autoComplete="off">
          <Input
            label="Full Name"
            name='fullName'
            type='text'
            value={formData.fullName}
            onChange={handleChange}
            placeholder='John Doe'
            icon={userIcon}
            autoComplete="off"
            required
          />
          
          <Input
            label="Email Address"
            name='email'
            type='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='you@example.com'
            icon={emailIcon}
            autoComplete="off"
            required
          />
          
          <Input
            label="Password"
            name='password'
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            placeholder='Minimum 6 characters'
            icon={lockIcon}
            helperText="Use a strong password with letters, numbers, and symbols"
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
            minLength={6}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-200">
              I am a <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'startup' })}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  formData.role === 'startup'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-purple-400/30 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🚀</div>
                  <div className="font-semibold text-white">Startup</div>
                  <div className="text-xs text-gray-400 mt-1">Seeking funding</div>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'investor' })}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  formData.role === 'investor'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-purple-400/30 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">💼</div>
                  <div className="font-semibold text-white">Investor</div>
                  <div className="text-xs text-gray-400 mt-1">Looking to invest</div>
                </div>
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            fullWidth
            loading={loading}
            className="mt-2"
          >
            Create Account
          </Button>
        </form>

        <div className="divider"></div>

        <div className='text-sm text-center text-gray-300'>
          Already have an account?{' '}
          <span
            className='text-purple-400 cursor-pointer font-semibold hover:text-purple-300 transition-colors'
            onClick={() => navigate('/login')}
          >
            Sign In →
          </span>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;