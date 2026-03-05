import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated
        const isAuthenticated = sessionStorage.getItem('isAuthenticated');
        const storedUsername = sessionStorage.getItem('username');

        if (!isAuthenticated || !storedUsername) {
            // Redirect to login if not authenticated
            navigate('/login');
        } else {
            setUsername(storedUsername);
        }
    }, [navigate]);

    const handleLogout = () => {
        // Clear session storage
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('username');
        
        // Redirect to login
        navigate('/login');
    };

    return (
        <div className="welcome-container">
            <div className="welcome-card">
                <h1>Welcome!</h1>
                <p className="welcome-message">
                    You have successfully logged in as <strong>{username}</strong>
                </p>
                <div className="welcome-actions">
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                    <button 
                        onClick={() => navigate('/login')} 
                        className="back-button"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Welcome;