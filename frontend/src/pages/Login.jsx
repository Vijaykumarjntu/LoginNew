import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    
    const navigate = useNavigate();

    // Check for saved username on component mount
    useEffect(() => {
        const savedUsername = localStorage.getItem('savedUsername');
        if (savedUsername) {
            setFormData(prev => ({ ...prev, username: savedUsername }));
            setRememberMe(true);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleRememberMeChange = (e) => {
        setRememberMe(e.target.checked);
    };

    const validateForm = () => {
        if (!formData.username.trim()) {
            setError('Username is required');
            return false;
        }
        if (!formData.password.trim()) {
            setError('Password is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const response = await axios.post(process.env.REACT_APP_BACKEND_URL, {
                username: formData.username.trim(),
                password: formData.password.trim()
            });

            if (response.data.success) {
                // Handle remember me
                if (rememberMe) {
                    localStorage.setItem('savedUsername', formData.username.trim());
                } else {
                    localStorage.removeItem('savedUsername');
                }

                // Store login state in session storage
                sessionStorage.setItem('isAuthenticated', 'true');
                sessionStorage.setItem('username', formData.username.trim());

                // Navigate to welcome page
                navigate('/welcome');
            }
        } catch (err) {
            if (err.response) {
                // Server responded with error
                setError(err.response.data.message || 'Login failed');
            } else if (err.request) {
                // Request made but no response
                setError('Network error. Please check your connection.');
            } else {
                // Something else happened
                setError('An unexpected error occurred');
            }
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Welcome Back</h2>
                <p className="subtitle">Please login to your account</p>
                
                {error && (
                    <div className="error-message" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            disabled={loading}
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            disabled={loading}
                            autoComplete="current-password"
                        />
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={handleRememberMeChange}
                                disabled={loading}
                            />
                            <span>Remember username</span>
                        </label>
                        <div className="demo-credentials">
                            <small>Demo: admin/admin</small>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;