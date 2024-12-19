import React, { useEffect, useState } from 'react';
import '../Profile.css';


const Profile = () => {
    const [username, setUsername] = useState('');
    const [levelsFinished, setLevelsFinished] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [totalRuns, setTotalRuns] = useState(0);
    const [profilePicture, setProfilePicture] = useState('');
    const [bio, setBio] = useState('');
    const [message, setMessage] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [tempBio, setTempBio] = useState('');
    const [tempFile, setTempFile] = useState(null); // file object
    const [spanElements, setSpanElements] = useState([]);
    

    useEffect(() => {
        fetch('http://localhost:5000/auth/me', {
            credentials: 'include'
        })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
            setUsername(data.username);
            setLevelsFinished(data.levelsFinished);
            setHighScore(data.highScore);
            setTotalRuns(data.totalRuns);
            setProfilePicture(data.profilePicture);
            setBio(data.bio);
        })
        .catch(err => {
            console.error(err);
            setMessage('You must be logged in to see your profile.');
        });

        const totalSquares = 200; 
        const arr = [];
        for (let i = 0; i < totalSquares; i++) {
            arr.push(<span key={i}></span>);
        }
        setSpanElements(arr);
    }, []);

    const handleSave = () => {
        const formData = new FormData();
        if (tempFile) formData.append('profilePicture', tempFile);
        formData.append('bio', tempBio);

        fetch('http://localhost:5000/auth/updateProfileWithImage', {
            method: 'PATCH',
            credentials: 'include',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                setMessage(data.error);
            } else {
                // Update local state
                if (data.profilePicture) setProfilePicture(data.profilePicture);
                setBio(tempBio);
                setMessage('Profile updated successfully');
                setEditMode(false);
            }
        })
        .catch(err => {
            console.error(err);
            setMessage('Server error while updating profile');
        });
    };

    return (
        <div className="profile-container">
            <div className="background-animation">
                {spanElements}
            </div>
            <div style={{ textAlign: 'left', margin: '1rem' }}>
            <a href="/" className="back-button-fixed-auth">Back</a>
            </div>
            <div className="profile-content">
                <div className="profile-left">
                    <div className="username">{username}</div>
                    <div className="stats">
                        <p>Levels Finished: {levelsFinished}</p>
                        <p>High Score: {highScore}</p>
                        <p>Total Runs: {totalRuns}</p>
                    </div>
                </div>
                <div className="profile-right">
                    {profilePicture && (
                        <img
                            src={profilePicture}
                            alt="Profile"
                            className="profile-picture"
                        />
                    )}
                    <div className="bio">{bio}</div>
                    {!editMode && (
                        <button
                            className="edit-button"
                            onClick={() => {
                                setTempBio(bio);
                                setTempFile(null);
                                setEditMode(true);
                            }}
                        >
                            Edit Profile
                        </button>
                    )}
                    {editMode && (
                        <div className="edit-form">
                            <input
                                type="file"
                                onChange={(e) => setTempFile(e.target.files[0])}
                            />
                            <textarea
                                value={tempBio}
                                onChange={(e) => setTempBio(e.target.value)}
                            />
                            <button onClick={handleSave}>Save</button>
                            <button onClick={() => setEditMode(false)}>Cancel</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
