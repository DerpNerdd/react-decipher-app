import React from 'react';
import { Link } from 'react-router-dom';
import '../TitlePage.css'; 

const TitlePage = () => {
  return (
    <div className="title-page">
      <h1 className="game-title">Transcipher</h1>
      <div className="button-container">
        <Link to="/play"><button>Play</button></Link>
        <Link to="/leaderboard"><button>Leaderboard</button></Link>
        <Link to="/signup"><button>Sign Up</button></Link>
        <Link to="/login"><button>Log In</button></Link>
        <Link to="/tutorial"><button>Tutorial</button></Link>
        <Link to="/credits"><button>Credits</button></Link>
      </div>
    </div>
  );
};

export default TitlePage;
