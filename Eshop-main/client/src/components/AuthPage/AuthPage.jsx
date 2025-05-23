import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';
import axios from 'axios'

export default function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    // licenseKey: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  // user login
  const login = () => {
    axios.get('http://localhost:3001/api/users/login', {
      params: {
        username: formData.username,
        password: formData.password
      }
    })
    .then(response => {
      if (response.data.length > 0) {
        sessionStorage.setItem('userName', formData.username);
        const userInfo = {
          userId: response.data[0].UserID,
          username: formData.username,
        }
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        onLogin(userInfo.username);

      } else {
        setError(response.data.msg || 'Login failed');
      }
    })
    .catch(error => {
      setError('Network error, please try again later');
      console.error('Login error:', error);
    });
  }

  // user registration
  const register = () => {
    axios.post('http://localhost:3001/api/users', {
      username: formData.username,
      password: formData.password,
      email: formData.email,
    })
    .then(response => {
      if (response.data.userId) {
        login();
      } else {
        setError(response.data.msg || 'Registration failed');
      }
    })
    .catch(error => {
      setError('Network error, please try again later');
      console.error('Registration Error:', error);
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      login();
    } else {
      if (!formData.username || !formData.password || !formData.confirmPassword || !formData.email) {
        setError('Please fill in all fields.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      register();
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          {!isLogin && (
            <>
              <label>
                Confirm Password:
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </label>
              <label>
                Email Address:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </label>
            </>
          )}
          {error && <p className="error">{error}</p>}
          <button className="submit-btn" type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
}
