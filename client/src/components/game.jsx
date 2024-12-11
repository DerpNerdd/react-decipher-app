import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

function generateKey(numCols) {
    const arr = [...Array(numCols).keys()].map(x => x + 1);
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function transpositionCipher(phrase, key) {
    const text = phrase.replace(/\s+/g, '').toUpperCase();
    const numCols = key.length;
    const numRows = Math.ceil(text.length / numCols);

    let grid = Array.from({ length: numRows }, () => Array(numCols).fill(''));
    let index = 0;
    for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
            grid[r][c] = index < text.length ? text[index] : '';
            index++;
        }
    }

    // Read columns in order of key
    const zeroBasedKey = key.map(k => k - 1);
    let cipher = '';
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
    const [checkedGuess, setCheckedGuess] = useState([]); 
    const [score, setScore] = useState(0);
    const [puzzlesCompleted, setPuzzlesCompleted] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [puzzleSolved, setPuzzleSolved] = useState(false); // NEW: track if current puzzle is solved

    const timerRef = useRef(null);
    const puzzleStartTimeRef = useRef(null);

    useEffect(() => {
        startNewPuzzle();
        startTimer();
        return () => {
            clearInterval(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) {
            endGame();
        }
    }, [timeLeft]);

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);
    };

    const startNewPuzzle = () => {
        const word = wordList[level % wordList.length];
        setOriginalWord(word);

        const length = word.replace(/\s+/g, '').length;
        let numCols;
        if (length <= 4) numCols = 2;
        else if (length <= 8) numCols = 3;
        else if (length <= 12) numCols = 4;
        else numCols = 5;

        const newKey = generateKey(numCols);
        setKey(newKey);
        const cipherText = transpositionCipher(word, newKey);
        setScrambledWord(cipherText);
        setGuess('');
        setFeedback('');
        setCheckedGuess([]);
        setPuzzleSolved(false); // Reset puzzle solved status
        puzzleStartTimeRef.current = Date.now();
    };

    const calculateScoreForPuzzle = (elapsedSeconds, wordLength, numCols) => {
        const baseScore = (numCols * 10) + wordLength;
        const parTime = 30;
        let bonus = 0;
        if (elapsedSeconds < parTime) {
            bonus = (parTime - elapsedSeconds) * 2;
        }
        return baseScore + bonus;
    };

    const handleSubmit = () => {
        if (timeLeft <= 0 || gameOver || puzzleSolved) return; // Ignore if game over, time out, or puzzle already solved

        const cleanedOriginal = originalWord.replace(/\s+/g, '').toUpperCase();
        const cleanedGuess = guess.trim().toUpperCase();

        let letterFeedback = [];
        const maxLen = Math.max(cleanedOriginal.length, cleanedGuess.length);
        for (let i = 0; i < maxLen; i++) {
            const originalChar = cleanedOriginal[i] || '';
            const guessChar = cleanedGuess[i] || ' ';
            letterFeedback.push({
                char: guessChar,
                correct: guessChar === originalChar
            });
        }
        setCheckedGuess(letterFeedback);

        if (cleanedGuess === cleanedOriginal) {
            setFeedback('Correct!');
            setPuzzleSolved(true); // Mark this puzzle as solved
            const elapsedMs = Date.now() - puzzleStartTimeRef.current;
            const elapsedSeconds = Math.floor(elapsedMs / 1000);
            const puzzleScore = calculateScoreForPuzzle(elapsedSeconds, cleanedOriginal.length, key.length);
            setScore(prev => prev + puzzleScore);
            setPuzzlesCompleted(prev => prev + 1);

            setTimeout(() => {
                setLevel(prev => prev + 1);
                startNewPuzzle();
            }, 1000);
        } else {
            setFeedback('Incorrect. Try again!');
        }
    };

    const endGame = () => {
        clearInterval(timerRef.current);
        setGameOver(true);
        setFeedback("Time's up! Game Over.");
    };

    const playAgain = () => {
        setLevel(0);
        setScore(0);
        setPuzzlesCompleted(0);
        setTimeLeft(TOTAL_TIME);
        setGameOver(false);
        startNewPuzzle();
        if (!timerRef.current) {
            startTimer();
        }
    };

    const timePercentage = (timeLeft / TOTAL_TIME) * 100;

    return (
        <div className="game-container" style={{ padding: '2rem', textAlign: 'center' }}>
            {!gameOver && (
                <>
                    <h2>Unscramble the Phrase</h2>
                    <div style={{ margin: '1rem 0' }}>
                        <strong>Key:</strong> {key.join('')}
                    </div>
                    <div style={{ margin: '1rem 0', fontSize: '1.5rem' }}>
                        {scrambledWord}
                    </div>
                    
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
                    <p>Score: {score}</p>
                    <p>Puzzles Completed: {puzzlesCompleted}</p>

                    <input
                        type="text"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        placeholder="Your guess here"
                        style={{ padding: '0.5rem', fontSize: '1rem', width: '200px', marginBottom: '1rem' }}
                        disabled={timeLeft <= 0 || gameOver || puzzleSolved}
                    />
                    <br />
                    <button onClick={handleSubmit} disabled={timeLeft <= 0 || gameOver || puzzleSolved} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
                        Submit
                    </button>

                    {feedback && (
                        <p style={{
                            marginTop: '1rem',
                            fontWeight: 'bold',
                            color: feedback === 'Correct!' ? 'green' : (feedback.startsWith("Time") ? 'red' : 'red')
                        }}>
                            {feedback}
                        </p>
                    )}

                    {checkedGuess.length > 0 && feedback !== 'Correct!' && (
                        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                            {checkedGuess.map((item, index) => (
                                <span key={index} style={{
                                    color: item.correct ? 'green' : 'red',
                                    margin: '0 2px',
                                    fontWeight: 'bold'
                                }}>
                                    {item.char}
                                </span>
                            ))}
                        </div>
                    )}
                </>
            )}

            {gameOver && (
                <div>
                    <h2>Game Over!</h2>
                    <p>Total Score: {score}</p>
                    <p>Puzzles Completed: {puzzlesCompleted}</p>
                    <button onClick={playAgain} style={{ margin: '1rem', padding: '0.5rem 1rem' }}>
                        Play Again
                    </button>
                    <Link to="/">
                        <button style={{ margin: '1rem', padding: '0.5rem 1rem' }}>Title Screen</button>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Game;
