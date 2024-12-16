import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TitlePage from './components/TitlePage';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Game from './components/game';
import Profile from './components/Profile';
import Logout from './components/Logout';
import Leaderboard from './components/Leaderboard';
import Tutorial from './components/Tutorial';
import Credits from './components/Credits';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<TitlePage />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/play" element={<Game />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/tutorial" element={<Tutorial />} />
                <Route path="/credits" element={<Credits />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
            </Routes>
        </Router>
    );
}

export default App;
