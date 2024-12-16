import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await fetch('http://localhost:5000/auth/login', {
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

    return (
        <div style={{textAlign: 'center', marginTop: '2rem'}}>
            <h2>Log In</h2>
            <form onSubmit={handleLogin} style={{display: 'inline-block', textAlign: 'left'}}>
                <div>
                    <label>Username:</label><br />
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div style={{marginTop: '1rem'}}>
                    <label>Password:</label><br />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" style={{marginTop: '1rem'}}>Log In</button>
            </form>
            {message && <p style={{marginTop: '1rem'}}>{message}</p>}
        </div>
    );
};

export default Login;
