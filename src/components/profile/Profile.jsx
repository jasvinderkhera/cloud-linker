import React, { useEffect, useState } from 'react';
import './Profile.css';
import { ref, set, get } from 'firebase/database';
import { realtimeDb } from '../../firebase/firebase'; // Ensure your Firebase Realtime Database instance is correctly imported
import { auth } from '../../firebase/firebase'; // Ensure Firebase Auth instance is imported

function Profile() {
    const [profilePic, setProfilePic] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch the profile picture from the database
        const fetchProfilePic = async () => {
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const profilePicRef = ref(realtimeDb, `users/${userId}/profilePicture`);
                const snapshot = await get(profilePicRef);
                if (snapshot.exists()) {
                    setProfilePic(snapshot.val());
                }
            }
        };
        fetchProfilePic();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageFile(reader.result); // Set the Base64 string
            };
            reader.readAsDataURL(file); // Read file as Base64
        }
    };

    const saveProfilePicture = async () => {
        if (!imageFile) {
            alert('Please select an image first.');
            return;
        }

        setLoading(true);
        try {
            const user = auth.currentUser;
            if (!user) {
                alert('User is not logged in.');
                return;
            }
            const userId = user.uid;
            const profilePicRef = ref(realtimeDb, `users/${userId}/profilePicture`);

            // Save the Base64 string to the Realtime Database
            await set(profilePicRef, imageFile);
            setProfilePic(imageFile); // Update the UI
            alert('Profile picture updated successfully!');
        } catch (error) {
            console.error('Error updating profile picture:', error);
            alert('Failed to update profile picture.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile">
            <h2>My Profile</h2>

            <div className="profile-pic-section">
                <div className="profile-pic-container">
                    {profilePic ? (
                        <img src={profilePic} alt="Profile" className="profile-pic" />
                    ) : (
                        <div className="placeholder-pic">No Profile Picture</div>
                    )}
                </div>
                <div className="upload-section">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="form-control"
                    />
                    <button
                        className="btn btn-primary mt-2"
                        onClick={saveProfilePicture}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;
