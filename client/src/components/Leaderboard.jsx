import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../leaderboard.css';

const Leaderboard = () => {
    const [scores, setScores] = useState([]);
    const [spanElements, setSpanElements] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/scores/leaderboard')
        .then(res => res.json())
        .then(data => {
            setScores(data);
        })
        .catch(err => console.error(err));

        const totalSquares = 200;
        const arr = [];
        for (let i = 0; i < totalSquares; i++) {
            arr.push(<span key={i}></span>);
        }
        setSpanElements(arr);
    }, []);

    return (
        <div className="leaderboard-page-container">
            <div className="background-animation-lb">
                {spanElements}
            </div>
            
            <Link to="/">
                <button className="back-button-fixed">Back</button>
            </Link>

            <div className="content-container-lb">
                <h1 className="leaderboard-title">Leaderboard</h1>
                <table className="score-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map((score, index) => {
                            let nameClass = "name-regular";
                            if (index === 0) nameClass = "name-gold";
                            else if (index === 1) nameClass = "name-silver";
                            else if (index === 2) nameClass = "name-bronze";
                            return (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td className={nameClass}>{score.username}</td>
                                    <td>{score.score}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;
