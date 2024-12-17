import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../TitlePage.css'; 

const TitlePage = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [spanElementsMobile, setSpanElementsMobile] = useState([]);
    const [spanElementsDesktop, setSpanElementsDesktop] = useState([]);
    const [useDesktop, setUseDesktop] = useState(false);

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

        // Mobile: Generate fewer, larger squares (5 across by ~8 down = 40 squares)
        const mobileSquares = 40;
        const mArray = [];
        for (let i = 0; i < mobileSquares; i++) {
            mArray.push(<span key={"m"+i}></span>);
        }
        setSpanElementsMobile(mArray);

        // Desktop: Generate more, smaller squares (let's say 10x10=100 squares)
        const desktopSquares = 100;
        const dArray = [];
        for (let i = 0; i < desktopSquares; i++) {
            dArray.push(<span key={"d"+i}></span>);
        }
        setSpanElementsDesktop(dArray);
    }, []);

    return (
        <div>
            {/* Toggle between mobile and desktop versions for demonstration */}
            <button style={{position:'absolute',top:'10px',left:'10px',zIndex:9999}} onClick={() => setUseDesktop(!useDesktop)}>
                Switch to {useDesktop?"Mobile":"Desktop"}
            </button>

            {useDesktop ? (
                <div className="title-page-desktop">
                    <div className="background-animation">
                        {spanElementsDesktop}
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
            ) : (
                <div className="title-page-mobile">
                    <div className="background-animation">
                        {spanElementsMobile}
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
            )}
        </div>
    );
};

export default TitlePage;
