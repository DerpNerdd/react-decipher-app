import React, { useEffect, useState } from 'react';

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
        <div style={{textAlign: 'center', marginTop: '2rem'}}>
            <div style={{ textAlign: 'left', margin: '1rem' }}>
                <a href="/"><button style={{ padding: '0.5rem 1rem' }}>Back</button></a>
            </div>
            <h2>Profile</h2>
            {message && <p>{message}</p>}
            {!message && (
                <>
                    {profilePicture && <img src={profilePicture} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />}
                    <p><strong>Username:</strong> {username}</p>
                    <p><strong>Levels Finished:</strong> {levelsFinished}</p>
                    <p><strong>High Score:</strong> {highScore}</p>
                    <p><strong>Total Runs:</strong> {totalRuns}</p>
                    <p><strong>Bio:</strong> {bio}</p>

                    {!editMode && (
                        <button onClick={() => {
                            setTempBio(bio);
                            setTempFile(null);
                            setEditMode(true);
                        }}>
                            Edit Profile
                        </button>
                    )}

                    {editMode && (
                        <div style={{marginTop: '1rem'}}>
                            <div>
                                <label>Profile Picture:</label><br />
                                <input type="file" onChange={(e) => setTempFile(e.target.files[0])} />
                            </div>
                            <div style={{marginTop: '1rem'}}>
                                <label>Bio:</label><br />
                                <textarea value={tempBio} onChange={(e) => setTempBio(e.target.value)} style={{width: '200px', height: '80px'}}/>
                            </div>
                            <button onClick={handleSave} style={{marginTop: '1rem', marginRight: '5px'}}>Save</button>
                            <button onClick={() => setEditMode(false)}>Cancel</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Profile;
