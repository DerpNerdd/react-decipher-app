import React from 'react';
import Game from './components/game';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Cipher School</h1>
      </header>
      <main>
        <Game />
      </main>
    </div>
  );
}

export default App;
