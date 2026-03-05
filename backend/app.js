const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



// In-memory user store (in production, this would be a database)
const VALID_CREDENTIALS = {
    username: 'admin',
    password: 'admin'
};

// Login endpoint
app.post('/api/login', async (req, res) => {
    console.log("route working")
    try {
        const { username, password } = req.body;

        // Input validation
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        if (typeof username !== 'string' || typeof password !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Invalid input format'
            });
        }

        // Trim and sanitize input
        const sanitizedUsername = username.trim();
        const sanitizedPassword = password.trim();

        // Check credentials (case-sensitive)
        if (sanitizedUsername === VALID_CREDENTIALS.username && 
            sanitizedPassword === VALID_CREDENTIALS.password) {
            
            // Successful login
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                user: {
                    username: sanitizedUsername,
                    // Don't send password back
                }
            });
        } else {
            // Failed login
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});