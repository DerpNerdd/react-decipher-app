import React from 'react';
import { Link } from 'react-router-dom';

const BackButton = () => (
    <div style={{ textAlign: 'left', margin: '1rem' }}>
        <Link to="/">
            <button style={{ padding: '0.5rem 1rem' }}>Back</button>
        </Link>
    </div>
);

export default BackButton;
