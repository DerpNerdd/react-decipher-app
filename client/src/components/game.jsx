import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { skipPuzzle, giveHint } from './puzzleActions';
import '../game.css';

function generateKey(numCols) {
    const arr = [...Array(numCols).keys()].map(x => x + 1);
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random()*(i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function transpositionCipher(phrase, key) {
    const text = phrase.replace(/\s+/g, '').toUpperCase();
    const numCols = key.length;
    const numRows = Math.ceil(text.length / numCols);
    let grid = Array.from({ length:numRows }, ()=>Array(numCols).fill(''));
    let index=0;
    for (let r=0;r<numRows;r++){
        for(let c=0;c<numCols;c++){
            grid[r][c]=index<text.length?text[index]:'';
            index++;
        }
    }
    const zeroBasedKey=key.map(k=>k-1);
    let cipher='';
    zeroBasedKey.forEach(k=>{
        for(let r=0;r<numRows;r++){
            if(grid[r][k]) cipher+=grid[r][k];
        }
    });
    return cipher;
}

const wordList=[
    "CAT","MOON","CLASSROOM","JAVASCRIPT","ENCIPHER","WATERFALL","TECHNOLOGY","TRANSPOSE","PLAYGROUND","CHRONOLOGY"
];

const TOTAL_TIME=60;

const Game=()=>{
    const [level,setLevel]=useState(0);
    const [scrambledWord,setScrambledWord]=useState('');
    const [originalWord,setOriginalWord]=useState('');
    const [guess,setGuess]=useState('');
    const [feedback,setFeedback]=useState('');
    const [key,setKey]=useState([]);
    const [timeLeft,setTimeLeft]=useState(TOTAL_TIME);
    const [checkedGuess,setCheckedGuess]=useState([]); 
    const [score,setScore]=useState(0);
    const [puzzlesCompleted,setPuzzlesCompleted]=useState(0);
    const [gameOver,setGameOver]=useState(false);
    const [puzzleSolved,setPuzzleSolved]=useState(false);
    const [numCols,setNumCols]=useState(0);
    const [numRows,setNumRows]=useState(0);
    const [gridGuess,setGridGuess]=useState([]);
    const [hintsLeft,setHintsLeft]=useState(3);
    const [hintMessages,setHintMessages]=useState([]);
    const [usedHintPositions,setUsedHintPositions]=useState(new Set());
    const [spanElements,setSpanElements]=useState([]);

    const timerRef=useRef(null);
    const puzzleStartTimeRef=useRef(null);

    useEffect(()=>{
        startNewPuzzle();
        startTimer();
        const totalSquares=200;
        const arr=[];
        for(let i=0;i<totalSquares;i++){
            arr.push(<span key={i}></span>);
        }
        setSpanElements(arr);
        return ()=>{clearInterval(timerRef.current);};
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    useEffect(()=>{
        if(timeLeft<=0){
            endGame();
        }
    },[timeLeft]);

    const startTimer=()=>{
        if(timerRef.current) clearInterval(timerRef.current);
        timerRef.current=setInterval(()=>{
            setTimeLeft(prev=>prev-1);
        },1000);
    };

    const startNewPuzzle=()=>{
        const word=wordList[level%wordList.length];
        setOriginalWord(word);
        const length=word.replace(/\s+/g,'').length;
        let cols;
        if(length<=4) cols=2;else if(length<=8) cols=3;else if(length<=12) cols=4;else cols=5;
        const newKey=generateKey(cols);
        setKey(newKey);
        const cipherText=transpositionCipher(word,newKey);
        setScrambledWord(cipherText);
        setGuess('');
        setFeedback('');
        setCheckedGuess([]);
        setPuzzleSolved(false);
        puzzleStartTimeRef.current=Date.now();
        setHintsLeft(3);
        setHintMessages([]);
        setUsedHintPositions(new Set());
        const rows=Math.ceil(length/cols);
        setNumCols(cols);
        setNumRows(rows);
        const newGrid=Array.from({length:rows},()=>Array(cols).fill(''));
        setGridGuess(newGrid);
    };

    const calculateScoreForPuzzle=(elapsedSeconds,wordLength,numCols)=>{
        const baseScore=(numCols*10)+wordLength;
        const parTime=30;
        let bonus=0;
        if(elapsedSeconds<parTime){
            bonus=(parTime - elapsedSeconds)*2;
        }
        return baseScore+bonus;
    };

    const handleSubmit=()=>{
        if(timeLeft<=0||gameOver||puzzleSolved)return;
        const cleanedOriginal=originalWord.replace(/\s+/g,'').toUpperCase();
        const finalGuess=guess.trim().toUpperCase();
        let letterFeedback=[];
        const maxLen=Math.max(cleanedOriginal.length,finalGuess.length);
        for(let i=0;i<maxLen;i++){
            const originalChar=cleanedOriginal[i]||'';
            const guessChar=finalGuess[i]||' ';
            letterFeedback.push({
                char:guessChar,
                correct:guessChar===originalChar
            });
        }
        setCheckedGuess(letterFeedback);
        if(finalGuess===cleanedOriginal){
            setFeedback('Correct!');
            setPuzzleSolved(true);
            const elapsedMs=Date.now()-puzzleStartTimeRef.current;
            const elapsedSeconds=Math.floor(elapsedMs/1000);
            const puzzleScore=calculateScoreForPuzzle(elapsedSeconds,cleanedOriginal.length,key.length);
            setScore(prev=>prev+puzzleScore);
            setPuzzlesCompleted(prev=>prev+1);
            setTimeout(()=>{
                setLevel(prev=>prev+1);
                startNewPuzzle();
            },1000);
        }else{
            setFeedback('Incorrect. Try again!');
        }
    };

    const endGame=()=>{
        clearInterval(timerRef.current);
        setGameOver(true);
        setFeedback("Time's up! Game Over.");
    };

    const playAgain=()=>{
        clearInterval(timerRef.current);
        setLevel(0);
        setScore(0);
        setPuzzlesCompleted(0);
        setTimeLeft(TOTAL_TIME);
        setGameOver(false);
        startNewPuzzle();
        startTimer();
    };

    const handleSkip=()=>{
        if(timeLeft<=0||gameOver||puzzleSolved)return;
        skipPuzzle(setLevel,startNewPuzzle,setPuzzleSolved,setFeedback);
    };

    const handleHint=()=>{
        if(timeLeft<=0||gameOver||puzzleSolved)return;
        if(hintsLeft>0){
            const result=giveHint(originalWord,guess,usedHintPositions);
            if(result===null){
                setFeedback("No more letters to reveal.");
                return;
            }
            const{position,char,index}=result;
            const newMessage=`${ordinal(position)} letter is ${char}`;
            setHintMessages(prev=>[...prev,newMessage]);
            setUsedHintPositions(prev=>{
                const newSet=new Set(prev);
                newSet.add(index);
                return newSet;
            });
            setHintsLeft(h=>h-1);
            setFeedback("Hint used!");
        }else{
            setFeedback("No hints left!");
        }
    };

    function ordinal(num){
        const suffixes=["th","st","nd","rd"];
        const val=num%100;
        return val+(suffixes[(val-20)%10]||suffixes[val]||suffixes[0]);
    }

    useEffect(()=>{
        if(gameOver&&score>0){
            fetch('http://localhost:5000/scores/save',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                credentials:'include',
                body:JSON.stringify({score,puzzlesCompleted})
            })
            .then(res=>res.json())
            .then(data=>{console.log("Score saved:",data);})
            .catch(err=>console.error(err));
        }
    },[gameOver,score]);

    const levelNumber=puzzlesCompleted+1;
    const timePercentage=(timeLeft/TOTAL_TIME)*100;

    const handleGridChange=(r,c,value)=>{
        const upperVal=value.toUpperCase().slice(0,1).replace(/[^A-Z]/g,''); 
        setGridGuess(prev=>{
            const newGrid=prev.map(row=>[...row]);
            newGrid[r][c]=upperVal;
            return newGrid;
        });
    };

    return(
        <div className="game-page-container">
            <div className="background-animation-game">
                {spanElements}
            </div>
            <a href="/" className="back-button-fixed-auth">Back</a>

            <div className="vertical-time-container">
                <div className="vertical-time-bar-container">
                    <div className="vertical-time-bar" style={{height:`${timePercentage}%`}}></div>
                </div>
                <div className="vertical-time-text-container">
                    <span className="vertical-time-text">{Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}</span>
                </div>
            </div>

            <div className="vertical-level-container">
                <div className="vertical-level-text-container">
                    <span className="vertical-level-text">Level {levelNumber}</span>
                </div>
            </div>

            <div className="game-top-center">
                <div className="game-key">Key: {key.join('')}</div>
                <div className="game-scrambled">{scrambledWord}</div>
            </div>

            <div className="scratch-pad-large">
                <div 
                    className="scratch-pad-grid"
                    style={{gridTemplateColumns:`repeat(${numCols},50px)`,gridTemplateRows:`repeat(${numRows},50px)`}}
                >
                    {gridGuess.map((row,r)=>
                        row.map((letter,c)=>(
                            <input
                                key={`${r}-${c}`}
                                type="text"
                                value={letter}
                                onChange={(e)=>handleGridChange(r,c,e.target.value)}
                                disabled={timeLeft<=0||gameOver||puzzleSolved}
                            />
                        ))
                    )}
                </div>
            </div>

            <div className="bottom-center-container">
                {feedback&&(
                    <p className={feedback.includes('Correct!')?'feedback-text correct':(feedback.includes('Time')?'feedback-text time-up':'feedback-text incorrect')}>
                        {feedback}
                    </p>
                )}
                {checkedGuess.length>0&&feedback!=='Correct!'&&(
                    <div className="checked-guess-container">
                        {checkedGuess.map((item,index)=>(
                            <span key={index} className={item.correct?'guess-letter correct-letter':'guess-letter incorrect-letter'}>
                                {item.char}
                            </span>
                        ))}
                    </div>
                )}
                {hintMessages.length>0&&(
                    <div className="hint-messages-container">
                        {hintMessages.map((msg,idx)=>(
                            <p key={idx} className="hint-message">{msg}</p>
                        ))}
                    </div>
                )}
                {!gameOver&&(
                    <>
                        <div className="answer-container">
                            <input
                                type="text"
                                value={guess}
                                onChange={(e)=>setGuess(e.target.value)}
                                placeholder="Final Answer"
                                disabled={timeLeft<=0||gameOver||puzzleSolved}
                                className="answer-input"
                                style={{textAlign:'center'}}
                            />
                        </div>
                        <button onClick={handleSubmit} disabled={timeLeft<=0||gameOver||puzzleSolved} className="check-button">
                            Check
                        </button>
                    </>
                )}
                {gameOver&&(
                    <div className="game-over-container">
                        <h2 className="game-over-title">Game Over!</h2>
                        <p className="final-score">Total Score: {score}</p>
                        <p className="final-completed">Puzzles Completed: {puzzlesCompleted}</p>
                        <button onClick={playAgain} className="game-button play-again-button">Play Again</button>
                        <Link to="/">
                            <button className="game-button title-button">Title Screen</button>
                        </Link>
                    </div>
                )}
            </div>

            {!gameOver&&(
                <div className="bottom-right-container">
                    <button onClick={handleSkip} disabled={timeLeft<=0||gameOver||puzzleSolved} className="game-button side-button big-side-button styled-side-button">Skip</button>
                    <button onClick={handleHint} disabled={timeLeft<=0||gameOver||puzzleSolved||hintsLeft<=0} className="game-button side-button big-side-button styled-side-button">Hint ({hintsLeft})</button>
                </div>
            )}
        </div>
    );
};

export default Game;
