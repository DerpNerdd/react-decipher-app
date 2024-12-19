import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Auth.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [spanElements, setSpanElements] = useState([]);

    useEffect(() => {
        const totalSquares = 200;
        const arr = [];
        for (let i = 0; i < totalSquares; i++) {
            arr.push(<span key={i}></span>);
        }
        setSpanElements(arr);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await fetch('https://react-decipher-app-backend.onrender.com/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Login successful!');
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                setMessage(data.error || 'Invalid credentials.');
            }
        } catch (error) {
            console.error(error);
            setMessage('Server error.');
        }
    };

    const messageClass = message.includes('successfully') || message.includes('successful') ? 'auth-message auth-success' : (message.includes('Invalid') || message.includes('error') ? 'auth-message auth-error' : 'auth-message');

    return (
        <div className="auth-page-container">
            <div className="background-animation-auth">
                {spanElements}
            </div>
            <a href="/" className="back-button-fixed-auth">Back</a>
            <div className="auth-content-container">
                <h2 className="auth-title">Log In</h2>
                <form onSubmit={handleLogin} className="auth-form">
                    <div className="auth-input-group">
                        <label>Username:</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="auth-input-group">
                        <label>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="auth-submit">Log In</button>
                </form>
                {message && <p className={messageClass}>{message}</p>}
            </div>
        </div>
    );
};

export default Login;
