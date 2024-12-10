import React, { useState, useEffect, useRef } from 'react';

function generateKey(numCols) {
    // Generate a random permutation of [1...numCols]
    const arr = [...Array(numCols).keys()].map(x => x + 1);
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function transpositionCipher(phrase, key) {
    // Remove spaces and make uppercase for simplicity
    const text = phrase.replace(/\s+/g, '').toUpperCase();
    const numCols = key.length;
    // Calculate number of rows
    const numRows = Math.ceil(text.length / numCols);
    // Create a 2D array (rows x cols)
    let grid = Array.from({ length: numRows }, () => Array(numCols).fill(''));
    // Fill the grid row-wise
    let index = 0;
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            grid[r][c] = index < text.length ? text[index] : '';
            index++;
        }
    }

    // Read the columns in the order of the key
    let cipher = '';
    // key = [2,0,3,1] would mean read column order: col2, col0, col3, col1 (but we have 1-based)
    // Adjust for zero-based indexing
    const zeroBasedKey = key.map(k => k - 1);
    zeroBasedKey.forEach(k => {
        for (let r = 0; r < numRows; r++) {
            if (grid[r][k]) cipher += grid[r][k];
        }
    });

    return cipher;
}

const wordList = [
    "CAT",
    "MOON",
    "CLASSROOM",
    "JAVASCRIPT",
    "ENCIPHER",
    "WATERFALL",
    "TECHNOLOGY",
    "TRANSPOSE",
    "PLAYGROUND",
    "CHRONOLOGY"
];

const TOTAL_TIME = 300; // 5 minutes in seconds

const Game = () => {
    const [level, setLevel] = useState(0);
    const [scrambledWord, setScrambledWord] = useState('');
    const [originalWord, setOriginalWord] = useState('');
    const [guess, setGuess] = useState('');
    const [feedback, setFeedback] = useState('');
    const [key, setKey] = useState([]);
    const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

    const timerRef = useRef(null);

    useEffect(() => {
        // Initialize the first puzzle when component mounts
        startNewPuzzle();
        // Start the timer
        startTimer();

        return () => {
            // Cleanup timer on unmount
            clearInterval(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // If time runs out, end the game (disable input maybe or show a message)
        if (timeLeft <= 0) {
            // Time is up
            clearInterval(timerRef.current);
            setFeedback("Time's up! Game Over.");
        }
    }, [timeLeft]);

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
    };

    const startNewPuzzle = () => {
        // Get a new word from the list based on current level
        const word = wordList[level % wordList.length]; // cycle through if surpass length
        setOriginalWord(word);

        // Choose a number of columns based on word length (2 to 5 columns for variety)
        let numCols = 4;
        if (word.length <= 4) numCols = 2;
        else if (word.length > 4 && word.length <= 8) numCols = 3;
        else if (word.length > 8 && word.length <= 12) numCols = 4;
        else numCols = 5;

        const newKey = generateKey(numCols);
        setKey(newKey);
        const cipherText = transpositionCipher(word, newKey);
        setScrambledWord(cipherText);
        setGuess('');
        setFeedback('');
    };

    const handleSubmit = () => {
        if (timeLeft <= 0) return; // no actions if time ran out

        if (guess.trim().toUpperCase() === originalWord.replace(/\s+/g, '').toUpperCase()) {
            setFeedback('Correct!');
            // Move to next level after a short delay
            setTimeout(() => {
                setLevel(prev => prev + 1);
                startNewPuzzle();
            }, 1000);
        } else {
            setFeedback('Incorrect. Try again!');
        }
    };

    // Calculate progress bar width
    const timePercentage = (timeLeft / TOTAL_TIME) * 100;

    return (
        <div className="game-container" style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Unscramble the Phrase</h2>
            
            <div style={{ margin: '1rem 0' }}>
                <strong>Key:</strong> {key.join('')}
            </div>

            <div style={{ margin: '1rem 0', fontSize: '1.5rem' }}>
                {scrambledWord}
            </div>

            {/* Progress bar container */}
            <div style={{
                width: '100%',
                maxWidth: '500px',
                height: '20px',
                background: '#ddd',
                margin: '0.5rem auto',
                borderRadius: '10px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${timePercentage}%`,
                    height: '100%',
                    background: '#76c893',
                    transition: 'width 1s linear'
                }}></div>
            </div>
            <p>Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</p>

            <input
                type="text"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Your guess here"
                style={{ padding: '0.5rem', fontSize: '1rem', width: '200px', marginBottom: '1rem' }}
                disabled={timeLeft <= 0}
            />
            <br />
            <button onClick={handleSubmit} disabled={timeLeft <= 0} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
                Submit
            </button>

            {feedback && (
                <p style={{
                    marginTop: '1rem',
                    fontWeight: 'bold',
                    color: feedback === 'Correct!' ? 'green' : (feedback.startsWith("Time's up") ? 'red' : 'red')
                }}>
                    {feedback}
                </p>
            )}
        </div>
    );
};

export default Game;
