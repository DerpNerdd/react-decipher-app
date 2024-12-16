import React from 'react';
import BackButton from './BackButton';

const Credits = () => {
    return (
        <div style={{textAlign: 'center', marginTop: '2rem'}}>
            <BackButton /> {/* Add this line */}
            <h2>Credits</h2>
            <p>Some credits here...</p>
        </div>
    );
};

export default Credits;
