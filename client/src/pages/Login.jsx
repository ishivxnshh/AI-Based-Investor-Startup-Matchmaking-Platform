import React, { useState } from 'react';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find(
      (user) => user.email === email || user.username === username
    );
    if (existingUser) {
      alert('Email or username already registered.');
      return;
    }
    const newUser = { username, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Sign-up successful! You can now log in.');
    window.location.href = 'login.html';
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundImage:
        'url("https://images.unsplash.com/photo-1556740714-a8395b3bf30f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
    }}>
      <div className="signup-container" style={{
        width: 300,
        margin: '100px auto',
        padding: 30,
        background: 'white',
        borderRadius: 6,
        boxShadow: '0 0 8px #aaa',
      }}>
        <form id="signup-form" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
          <input
            type="text"
            id="signup-username"
            placeholder="Username"
            required
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{ width: '100%', padding: 10, margin: '8px 0' }}
          />
          <input
            type="email"
            id="signup-email"
            placeholder="Email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: 10, margin: '8px 0' }}
          />
          <input
            type="password"
            id="signup-password"
            placeholder="Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: '100%', padding: 10, margin: '8px 0' }}
          />
          <button
            type="submit"
            style={{ width: '100%', padding: 10, margin: '8px 0', background: '#0370cf', color: 'rgb(224, 222, 222)', border: 'none' }}
          >
            Sign Up
          </button>
        </form>
        <div className="link-to-login" style={{ textAlign: 'center', marginTop: 10 }}>
          <a href="login.html" style={{ color: '#0370cf' }}>
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
