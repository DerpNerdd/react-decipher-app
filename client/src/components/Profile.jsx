import React, { useEffect, useState } from 'react';

const Profile = () => {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('Loading...');

    useEffect(() => {
        fetch('http://localhost:5000/auth/me', {
            credentials: 'include'
        })
        .then(res => {
            if (res.ok) return res.json();
            throw new Error('Not authenticated');
        })
        .then(data => {
            setUsername(data.username);
            setMessage('');
        })
        .catch(err => {
            console.error(err);
            setMessage('You must be logged in to see your profile.');
        });
    }, []);

    return (
        <div style={{textAlign: 'center', marginTop: '2rem'}}>
            <h2>Profile</h2>
            {message && <p>{message}</p>}
            {username && <p>Welcome, {username}!</p>}
        </div>
    );
};

export default Profile;
