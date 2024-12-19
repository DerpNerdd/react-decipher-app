import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Tutorial.css';


const Tutorial = () => {

    const navigate = useNavigate();

    const handlePlayClick = () => {
        navigate('/play'); // Replace '/game' with the actual route for Game.jsx in your app.
    };

    return (
        <div className="tutorial-container">
            <div className="background-animation">
                {Array.from({ length: 200 }).map((_, index) => (
                    <span key={index}></span>
                ))}
            </div>
            <a href="/" className="back-button-fixed-auth">Back</a>
            <div className="tutorial-content">
                <h2 className="tutorial-title">Tutorial</h2>
                <div className="tutorial-section">
                    <div className="tutorial-left">
                        <h3>1. Understand the Cipher</h3>
                        <p>You will be given a scrambled phrase and a key. For example:</p>
                        <p><strong>Scrambled Phrase:</strong> TISEHTSRCPAEEDR</p>
                        <p><strong>Key:</strong> 4312</p>
                        <p>The key tells you the order of the columns in a grid. Each number represents a column's position in the correct order.</p>
                    </div>
                    <div className="tutorial-center">
                        <h3>2. Create a Grid</h3>
                        <div className="cipher-box"></div>
                        <div className="cipher-box"></div>
                        <p>Using the key (e.g., 4312), create a grid with 4 columns</p>
                        <p>Fill the grid row by row with letters from the scrambled phrase.</p>
                    </div>
                    <div className="tutorial-right">
                        <h3>3. Unscramble and Solve</h3>
                        <div className="clock-icon"></div>
                        <p>Rearrange the columns according to the key order</p>
                        <p>Read the columns from left to right to form the original phrase:</p>
                        <p><strong>Original Phrase:</strong> THISISTHECIPHER</p>
                        <p>Enter your answer and submit!</p>
                    </div>
                </div>
                <button className="play-button" onClick={handlePlayClick}>PLAY</button>
            </div>
        </div>
    );
};

export default Tutorial;
