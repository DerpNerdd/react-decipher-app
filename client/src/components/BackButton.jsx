import React from 'react';
import { Link } from 'react-router-dom';

const BackButton = () => (
    <Link to="/">
        <button className="back-button-fixed-auth">Back</button>
    </Link>
);

export default BackButton;
