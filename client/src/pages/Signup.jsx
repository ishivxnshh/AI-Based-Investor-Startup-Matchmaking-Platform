import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'

const Register = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    bio: '',
    role: '',
  })
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (!isDataSubmitted) {
      setIsDataSubmitted(true)
      return
    }

    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    const result = await response.json()
    if (response.ok) {
      if (formData.role === 'startup') navigate('/startup-form')
      else navigate('/investor-form')
    } else {
      alert(result.message || 'Signup failed')
    }
  }

  return (
    <AuthLayout>
      <h2 className='text-2xl font-semibold'>Sign Up</h2>

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-4'>
        {!isDataSubmitted && (
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
        )}

        {isDataSubmitted && (
          <textarea
            name='bio'
            value={formData.bio}
            onChange={handleChange}
            placeholder='Provide a short bio...'
            rows={4}
            className='p-2 border border-gray-500 rounded-md text-black'
            required
          />
        )}

        <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md'>
          {isDataSubmitted ? 'Create Account' : 'Continue'}
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
