import React from 'react';
import BackButton from './BackButton';

const Tutorial = () => {
    return (
        <div style={{textAlign: 'center', marginTop: '2rem'}}>
            <BackButton /> {/* Add this line */}
            <h2>Tutorial</h2>
            <p>Instructions on how to play...</p>
        </div>
    );
};

export default Tutorial;
