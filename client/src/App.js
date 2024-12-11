import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TitlePage from './components/TitlePage';
import Game from './components/game';
import Leaderboard from './components/Leaderboard';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Tutorial from './components/Tutorial';
import Credits from './components/Credits';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TitlePage />} />
        <Route path="/play" element={<Game />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tutorial" element={<Tutorial />} />
        <Route path="/credits" element={<Credits />} />
      </Routes>
    </Router>
  );
}

export default App;
