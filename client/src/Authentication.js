import React, { useState } from 'react';
import { login, register, logout } from './api';

import './Authentication.css'; // Make sure to create this CSS file for styling


const Authentication = ({ isAuthenticated, setIsAuthenticated }) => {
    const [username, setusername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await login(username, password);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleRegister = async () => {
        try {
            const response = await register(username, password);
            // setIsAuthenticated(true);
            // You may automatically log in the user after registration
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    const handleLogout = async () => {
        await logout();
        setIsAuthenticated(false);
    };

    return (
        <div>
            {isAuthenticated ? (
                <button onClick={handleLogout}>Logout</button>
            ) : (
                <div>
                    <input 
                        type="username" 
                        placeholder="username" 
                        value={username}
                        onChange={(e) => setusername(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin}>Login</button>
                    <button onClick={handleRegister}>Register</button>
                </div>
            )}
        </div>
    );
};

export default Authentication;
