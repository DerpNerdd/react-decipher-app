import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../TitlePage.css';

const TitlePage = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [spanElements, setSpanElements] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/auth/me', {
            credentials: 'include'
        })
        .then(res => {
            if (res.ok) return res.json();
            throw new Error('Not authenticated');
        })
        .then(() => {
            setLoggedIn(true);
        })
        .catch(() => {
            setLoggedIn(false);
        });

        const totalSquares = 200; 
        const arr = [];
        for (let i = 0; i < totalSquares; i++) {
            arr.push(<span key={i}></span>);
        }
        setSpanElements(arr);
    }, []);

    return (
        <div className="title-page-container">
            <div className="background-animation">
                {spanElements}
            </div>
            <div className="content-container">
                <h1 className="game-title">Transcipher</h1>
                <div className="button-container">
                    <Link to="/play"><button>Play</button></Link>
                    <Link to="/leaderboard"><button>Leaderboard</button></Link>
                    {!loggedIn && <Link to="/signup"><button>Sign Up</button></Link>}
                    {!loggedIn && <Link to="/login"><button>Log In</button></Link>}
                    {loggedIn && <Link to="/profile"><button>Profile</button></Link>}
                    {loggedIn && <Link to="/logout"><button>Logout</button></Link>}
                    <Link to="/tutorial"><button>Tutorial</button></Link>
                    <Link to="/credits"><button>Credits</button></Link>
                </div>
            </div>
        </div>
    );
};

export default TitlePage;
