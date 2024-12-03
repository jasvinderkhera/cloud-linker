import React, { useState } from 'react';
import { ref, set } from 'firebase/database';
import { auth, realtimeDb } from '../../../firebase/firebase'; // Import auth and realtimeDb

function UploadDoc() {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
        setFileName(file.name);
    };

    const sanitizeFileName = (fileName) => {
        return fileName.replace(/[.#$\[\]]/g, "_");  // Replace invalid characters with underscores
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }

        const sanitizedFileName = sanitizeFileName(fileName);  // Sanitize the file name
        const user = auth.currentUser;
        if (!user) {
            setError('No user is logged in.');
            return;
        }

        const userId = user.uid;  // Get the current user's UID
        const reader = new FileReader();

        reader.onload = async () => {
            const base64Image = reader.result.split(',')[1]; // Base64 encoded image
            const docRef = ref(realtimeDb, `users/${userId}/documents/${sanitizedFileName}`); // Store under user's UID

            try {
                await set(docRef, {
                    name: fileName,
                    image: base64Image,
                    createdAt: new Date().toISOString(),
                });
                alert('Document uploaded successfully!');
            } catch (error) {
                console.error('Upload failed:', error.message);
                setError(`Upload failed: ${error.message}`);
            }
        };

        reader.onerror = (error) => {
            setError(`FileReader error: ${error.message}`);
            console.error('FileReader error:', error.message);
        };

        reader.readAsDataURL(file); // Convert image to base64
    };

    return (
        <form onSubmit={handleUpload}>
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                required 
            />
            <button type="submit">Upload Document</button>
            {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}

export default UploadDoc;