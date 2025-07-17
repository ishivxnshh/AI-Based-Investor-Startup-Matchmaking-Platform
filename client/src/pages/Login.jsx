import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'

const LoginPage = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Login.jsx
const onSubmitHandler = async (e) => {
  e.preventDefault()
  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (response.ok) {
      const user = await response.json();
      localStorage.setItem('currentUser', JSON.stringify(user));
      const hasFilledForm = localStorage.getItem(`hasFilled${user.role}Form`) === 'true';
      
      if (!hasFilledForm) {
        navigate(user.role === 'startup' ? '/startup-form' : '/investor-form');
      } else {
        navigate(user.role === 'startup' ? '/startup-dashboard' : '/investor-dashboard');
      }
      return
    } else {
      throw new Error('Backend login failed')
    }
  } catch (err) {
    // Fallback: Authenticate using localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.email === email && u.password === password)
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user))
      const hasFilledForm = localStorage.getItem(`hasFilled${user.role}Form`) === 'true';
      
      if (!hasFilledForm) {
        navigate(user.role === 'startup' ? '/startup-form' : '/investor-form');
      } else {
        navigate(user.role === 'startup' ? '/startup-dashboard' : '/investor-dashboard');
      }
    } else {
      alert('Invalid email or password!')
    }
  }
}

  return (
    <AuthLayout>
      <h2 className='text-2xl font-semibold'>Login</h2>

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
        <input
          name='email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email Address'
          className='p-2 border border-gray-500 rounded-md text-black'
          required
        />
        <input
          name='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
          className='p-2 border border-gray-500 rounded-md text-black'
          required
        />

        <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md'>
          Login
        </button>
      </form>

      <div className='flex items-center gap-2 text-sm text-gray-400 mt-2'>
        <input type='checkbox' required />
        <p>I agree to the terms & privacy policy.</p>
      </div>

      <div className='text-sm text-gray-300 mt-2'>
        <p>
          Don’t have an account?{' '}
          <span
            className='text-violet-400 cursor-pointer underline'
            onClick={() => navigate('/Register')}
          >
            Sign up
          </span>
        </p>
      </div>
    </AuthLayout>
  )
}

export default LoginPage
