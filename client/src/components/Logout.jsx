import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Call the logout endpoint
        fetch('http://localhost:5000/auth/logout', {
            method: 'POST',
            credentials: 'include'
        }).then(res => res.json())
          .then(data => {
            // After logging out, redirect to title page
            navigate('/');
          })
          .catch(err => console.error(err));
    }, [navigate]);

    return (
        <div style={{textAlign: 'center', marginTop: '2rem'}}>
            <h2>Logging Out...</h2>
        </div>
    );
};

export default Logout;
