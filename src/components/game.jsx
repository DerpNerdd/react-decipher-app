import React, { useState, useEffect } from 'react';

function shuffleWord(word) {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join('');
}

const Game = () => {
    const originalWord = "CLASSROOM";
    const [scrambledWord, setScrambledWord] = useState('');
    const [guess, setGuess] = useState('');
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        // Scramble the word on mount
        const scrambled = shuffleWord(originalWord);
        setScrambledWord(scrambled);
    }, [originalWord]);

    const handleSubmit = () => {
        if (guess.trim().toUpperCase() === originalWord.toUpperCase()) {
            setFeedback('Correct!');
        } else {
            setFeedback('Incorrect. Try again!');
        }
    }

    return (
        <div className="game-container">
            <h2>Unscramble the Word</h2>
            <p id="scrambled-word">{scrambledWord}</p>
            <input 
                type="text" 
                value={guess} 
                onChange={(e) => setGuess(e.target.value)} 
                placeholder="Your guess here" 
            />
            <button onClick={handleSubmit}>Submit</button>
            {feedback && <p className={feedback === 'Correct!' ? 'feedback-correct' : 'feedback-incorrect'}>{feedback}</p>}
        </div>
    );
};

export default Game;
