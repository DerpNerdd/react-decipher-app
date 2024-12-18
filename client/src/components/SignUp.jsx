import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Auth.css';

const SignUp = () => {
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

    const handleSignUp = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await fetch('http://localhost:5000/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('User created successfully!');
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            } else {
                setMessage(data.error || 'An error occurred.');
            }
        } catch (error) {
            console.error(error);
            setMessage('Server error.');
        }
    };

    const messageClass = message.includes('successfully') ? 'auth-message auth-success' : (message.includes('Invalid') || message.includes('error') ? 'auth-message auth-error' : 'auth-message');

    return (
        <div className="auth-page-container">
            <div className="background-animation-auth">
                {spanElements}
            </div>
            <a href="/" className="back-button-fixed-auth">Back</a>
            <div className="auth-content-container">
                <h2 className="auth-title">Sign Up</h2>
                <form onSubmit={handleSignUp} className="auth-form">
                    <div className="auth-input-group">
                        <label>Username:</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="auth-input-group">
                        <label>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="auth-submit">Sign Up</button>
                </form>
                {message && <p className={messageClass}>{message}</p>}
            </div>
        </div>
    );
};

export default SignUp;
