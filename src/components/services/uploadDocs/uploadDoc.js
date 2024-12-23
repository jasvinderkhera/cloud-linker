import React, { useState } from 'react';
import { ref, set } from 'firebase/database';
import { auth, realtimeDb } from '../../../firebase/firebase'; // Import auth and realtimeDb
import { images } from '../../../constant/ImagePath';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
            toast.error('Please select a file to upload.');
            return;
        }

        const sanitizedFileName = sanitizeFileName(fileName);  // Sanitize the file name
        const user = auth.currentUser;
        if (!user) {
            toast.error('No user is logged in.');
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
                toast.success('Document uploaded successfully!');
            } catch (error) {
                console.error('Upload failed:', error.message);
                toast.error(`Upload failed: ${error.message}`);
            }
        };

        reader.onerror = (error) => {
            toast.error(`FileReader error: ${error.message}`);
            console.error('FileReader error:', error.message);
        };

        reader.readAsDataURL(file); // Convert image to base64
    };

    return (
       <div className="d-flex flex-column justify-content-center align-items-center py-5 my-5">
        <img src={images.upload} alt="" className='mb-4'/>
         <form onSubmit={handleUpload} className='d-flex flex-column justify-content-center align-items-center'>
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                required 
                className='border border-3 rounded-2'
            />
            <button type="submit" className='btn-primary btn mt-4 py-2'>Upload Document</button>
            {uploadProgress > 0 && <p>Upload Progress: {uploadProgress}%</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
       </div>
    );
}

export default UploadDoc;
