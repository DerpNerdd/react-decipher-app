import React from 'react';
import '../Credits.css';

const Credits = () => {
    return (
        <div className="credits-container">
            <div className="background-animation">
                {Array.from({ length: 200 }).map((_, index) => (
                    <span key={index}></span>
                ))}
            </div>
            <a href="/" className="back-button-fixed-auth">Back</a>
            <div className="credits-content">
                <h2 className="credits-title">Credits</h2>
                <p>
                    <strong>Developer:</strong> Alan Sanchez
                </p>
                <p>
                    This project was created using <strong>React</strong>, <strong>Node.js</strong>, 
                    <strong> MongoDB</strong>, <strong>Cloudinary</strong>, 
                    <strong> the Bad Words API</strong>, and <strong>Concurrently</strong> for testing.
                </p>
                <p>
                    The colors were inspired by React's theme and the Sound Voltex design.
                </p>
            </div>
        </div>
    );
};

export default Credits;
