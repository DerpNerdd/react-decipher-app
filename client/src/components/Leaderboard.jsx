import React, { useEffect, useState } from 'react';

const Leaderboard = () => {
    const [scores, setScores] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/scores/leaderboard')
            .then(res => res.json())
            .then(data => setScores(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div style={{textAlign: 'center', marginTop: '2rem'}}>
            <h2>Leaderboard</h2>
            <table style={{margin: '0 auto', borderCollapse: 'collapse'}}>
                <thead>
                    <tr>
                        <th style={{border: '1px solid #333', padding: '5px'}}>Rank</th>
                        <th style={{border: '1px solid #333', padding: '5px'}}>Username</th>
                        <th style={{border: '1px solid #333', padding: '5px'}}>Score</th>
                        <th style={{border: '1px solid #333', padding: '5px'}}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {scores.map((s, i) => (
                        <tr key={s._id}>
                            <td style={{border: '1px solid #333', padding: '5px'}}>{i+1}</td>
                            <td style={{border: '1px solid #333', padding: '5px'}}>{s.username}</td>
                            <td style={{border: '1px solid #333', padding: '5px'}}>{s.score}</td>
                            <td style={{border: '1px solid #333', padding: '5px'}}>{new Date(s.date).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
