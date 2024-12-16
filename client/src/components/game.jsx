import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { skipPuzzle, giveHint } from './puzzleActions';
import BackButton from './BackButton'; 


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

const TOTAL_TIME = 60; // 5 minutes in seconds

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
    const [puzzleSolved, setPuzzleSolved] = useState(false);

    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

    const timerRef = useRef(null);
    const puzzleStartTimeRef = useRef(null);

    const [numCols, setNumCols] = useState(0);
    const [numRows, setNumRows] = useState(0);
    const [gridGuess, setGridGuess] = useState([]);

    const [hintsLeft, setHintsLeft] = useState(3);
    const [hintMessages, setHintMessages] = useState([]);
    const [usedHintPositions, setUsedHintPositions] = useState(new Set());

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth > 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        let cols;
        if (length <= 4) cols = 2;
        else if (length <= 8) cols = 3;
        else if (length <= 12) cols = 4;
        else cols = 5;

        const newKey = generateKey(cols);
        setKey(newKey);
        const cipherText = transpositionCipher(word, newKey);
        setScrambledWord(cipherText);
        setGuess('');
        setFeedback('');
        setCheckedGuess([]);
        setPuzzleSolved(false);
        puzzleStartTimeRef.current = Date.now();
        setHintsLeft(3);
        setHintMessages([]);
        setUsedHintPositions(new Set());

        const rows = Math.ceil(length / cols);
        setNumCols(cols);
        setNumRows(rows);

        const newGrid = Array.from({length: rows}, () => Array(cols).fill(''));
        setGridGuess(newGrid);
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
        if (timeLeft <= 0 || gameOver || puzzleSolved) return;

        const cleanedOriginal = originalWord.replace(/\s+/g, '').toUpperCase();
        const finalGuess = guess.trim().toUpperCase();

        let letterFeedback = [];
        const maxLen = Math.max(cleanedOriginal.length, finalGuess.length);
        for (let i = 0; i < maxLen; i++) {
            const originalChar = cleanedOriginal[i] || '';
            const guessChar = finalGuess[i] || ' ';
            letterFeedback.push({
                char: guessChar,
                correct: guessChar === originalChar
            });
        }
        setCheckedGuess(letterFeedback);

        if (finalGuess === cleanedOriginal) {
            setFeedback('Correct!');
            setPuzzleSolved(true);
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

    const handleSkip = () => {
        if (timeLeft <= 0 || gameOver || puzzleSolved) return;
        skipPuzzle(setLevel, startNewPuzzle, setPuzzleSolved, setFeedback);
    };

    const handleHint = () => {
        if (timeLeft <= 0 || gameOver || puzzleSolved) return;
        if (hintsLeft > 0) {
            const result = giveHint(originalWord, guess, usedHintPositions);
            if (result === null) {
                // No more letters to reveal
                setFeedback("No more letters to reveal.");
                return;
            }

            const { position, char, index } = result;
            const newMessage = `${ordinal(position)} letter is ${char}`;
            setHintMessages(prev => [...prev, newMessage]);

            // Mark this position as used
            setUsedHintPositions(prev => {
                const newSet = new Set(prev);
                newSet.add(index);
                return newSet;
            });

            setHintsLeft(h => h - 1);
            setFeedback("Hint used!");
        } else {
            setFeedback("No hints left!");
        }
    };

    function ordinal(num) {
        const suffixes = ["th","st","nd","rd"];
        const val = num % 100;
        return val + (suffixes[(val - 20) % 10] || suffixes[val] || suffixes[0]);
    }

    const timePercentage = (timeLeft / TOTAL_TIME) * 100;

    const handleGridChange = (r, c, value) => {
        const upperVal = value.toUpperCase().slice(0,1).replace(/[^A-Z]/g,''); 
        setGridGuess(prev => {
            const newGrid = prev.map(row => [...row]);
            newGrid[r][c] = upperVal;
            return newGrid;
        });
    };

    const cellSize = 40;
    const gapSize = 8;
    const gridWidth = numCols > 0 ? (numCols * cellSize) + ((numCols - 1) * gapSize) : 0;

    useEffect(() => {
        if (gameOver && score > 0) {
            fetch('http://localhost:5000/scores/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', 
                body: JSON.stringify({ score })
            })
            .then(res => res.json())
            .then(data => {
                console.log("Score saved:", data);
            })
            .catch(err => console.error(err));
        }
    }, [gameOver, score]);


    return (
        <div className="game-container" style={{ padding: '2rem', textAlign: 'center' }}>
            <BackButton />
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

                    {isDesktop && (
                        <div style={{
                            display: 'inline-block',
                            marginBottom: '1rem',
                            border: '1px solid #333',
                            padding: '15px',
                            paddingRight: '20px',
                            borderRadius: '5px',
                            textAlign: 'center'
                        }}>
                            <p style={{marginBottom: '0.5rem', fontWeight: 'bold'}}>Scratch Pad</p>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${numCols}, ${cellSize}px)`,
                                gap: `${gapSize}px`,
                                width: `${gridWidth}px`,
                                margin: '0 auto'
                            }}>
                                {gridGuess.map((row, r) => 
                                    row.map((letter, c) => (
                                        <input
                                            key={`${r}-${c}`}
                                            type="text"
                                            value={letter}
                                            onChange={(e) => handleGridChange(r, c, e.target.value)}
                                            style={{
                                                width: `${cellSize}px`,
                                                height: `${cellSize}px`,
                                                textAlign: 'center',
                                                fontSize: '1.2rem'
                                            }}
                                            disabled={timeLeft <= 0 || gameOver || puzzleSolved}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    <div style={{marginTop: '1rem'}}>
                        <input
                            type="text"
                            value={guess}
                            onChange={(e) => setGuess(e.target.value)}
                            placeholder="Final Answer"
                            style={{ padding: '0.5rem', fontSize: '1rem', width: '200px', marginBottom: '1rem' }}
                            disabled={timeLeft <= 0 || gameOver || puzzleSolved}
                        />
                        <br />
                        <button 
                            onClick={handleSubmit} 
                            disabled={timeLeft <= 0 || gameOver || puzzleSolved} 
                            style={{ padding: '0.5rem 1rem', fontSize: '1rem', marginRight: '5px' }}>
                            Submit
                        </button>
                        <button 
                            onClick={handleSkip} 
                            disabled={timeLeft <= 0 || gameOver || puzzleSolved} 
                            style={{ padding: '0.5rem 1rem', fontSize: '1rem', marginRight: '5px' }}>
                            Skip
                        </button>
                        <button 
                            onClick={handleHint} 
                            disabled={timeLeft <= 0 || gameOver || puzzleSolved || hintsLeft <= 0} 
                            style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
                            Hint ({hintsLeft})
                        </button>
                    </div>

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

                    {/* Display hint messages (accumulate) */}
                    {hintMessages.length > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                            {hintMessages.map((msg, idx) => (
                                <p key={idx} style={{margin: '5px 0', fontStyle: 'italic'}}>
                                    {msg}
                                </p>
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
