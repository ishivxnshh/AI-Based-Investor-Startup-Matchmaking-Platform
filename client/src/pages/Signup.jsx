import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'

const Register = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
  })
  // Remove isDataSubmitted state
  // const [isDataSubmitted, setIsDataSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        if (formData.role === 'startup') navigate('/startup-dashboard')
        else navigate('/investor-dashboard')
        return
      } else {
        // If backend returns error, fall back to localStorage
        throw new Error('Backend signup failed')
      }
    } catch (err) {
      // Fallback: Save user to localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      if (users.some(u => u.email === formData.email)) {
        alert('Email already registered!')
        return
      }
      users.push(formData)
      localStorage.setItem('users', JSON.stringify(users))
      if (formData.role === 'startup') navigate('/startup-dashboard')
      else navigate('/investor-dashboard')
    }
  }

  return (
    <AuthLayout>
      <h2 className='text-2xl font-semibold'>Sign Up</h2>

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
        <>
          <input
            name='fullName'
            type='text'
            value={formData.fullName}
            onChange={handleChange}
            placeholder='Full Name'
            className='p-2 border border-gray-500 rounded-md text-black'
            required
          />
          <input
            name='email'
            type='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='Email Address'
            className='p-2 border border-gray-500 rounded-md text-black'
            required
          />
          <input
            name='password'
            type='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='Password'
            className='p-2 border border-gray-500 rounded-md text-black'
            required
          />
          <select
            name='role'
            value={formData.role}
            onChange={handleChange}
            required
            className='p-2 border border-gray-500 rounded-md text-black'
          >
            <option value='' disabled>Select your role</option>
            <option value='startup'>Startup</option>
            <option value='investor'>Investor</option>
          </select>
        </>
        <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md'>
          Create Account
        </button>
      </form>

      <div className='flex items-center gap-2 text-sm text-gray-400 mt-2'>
        <input type='checkbox' required />
        <p>I agree to the terms & privacy policy.</p>
      </div>

      <div className='text-sm text-gray-300 mt-2'>
        <p>
          Already have an account?{' '}
          <span
            className='text-violet-400 cursor-pointer underline'
            onClick={() => navigate('/login')}
          >
            Login here
          </span>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Register
