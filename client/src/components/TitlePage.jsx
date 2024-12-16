import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../TitlePage.css'; 


const TitlePage = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        fetch('http://localhost:5000/auth/me', {
            credentials: 'include'
        })
        .then(res => {
            if (res.ok) return res.json();
            throw new Error('Not authenticated');
        })
        .then(data => {
            setLoggedIn(true);
        })
        .catch(err => {
            setLoggedIn(false);
        });
    }, []);

    return (
        <div style={{textAlign: 'center', marginTop: '2rem'}}>
            <h1>Transcipher</h1>
            <Link to="/play"><button>Play</button></Link>
            <Link to="/leaderboard"><button>Leaderboard</button></Link>
            {!loggedIn && <Link to="/signup"><button>Sign Up</button></Link>}
            {!loggedIn && <Link to="/login"><button>Log In</button></Link>}
            {loggedIn && <Link to="/profile"><button>Profile</button></Link>}
            {loggedIn && <Link to="/logout"><button>Logout</button></Link>}
            <Link to="/tutorial"><button>Tutorial</button></Link>
            <Link to="/credits"><button>Credits</button></Link>
        </div>
    );
};

export default TitlePage;
