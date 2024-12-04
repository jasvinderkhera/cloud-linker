import React, { useEffect, useState } from 'react';
import './viewDocs.css'
import { ref, onValue, remove } from 'firebase/database';
import { realtimeDb } from '../../../firebase/firebase';
import { auth } from '../../../firebase/firebase'; // Ensure you're importing auth
import { images } from '../../../constant/ImagePath';

function ViewDocs() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [show, setShow] =useState(null)

    useEffect(() => {
        const user = auth.currentUser; // Get the current user from auth
        if (!user) {
            setError('No user is logged in.');
            setLoading(false);
            return;
        }

        const userId = user.uid;
        const docRef = ref(realtimeDb, `users/${userId}/documents`); // Use the correct path for the user's documents

        onValue(docRef, (snapshot) => {
            const data = snapshot.val();
            console.log('Fetched data:', data); // Log the data for debugging

            if (data) {
                const docs = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));
                setDocuments(docs);
            } else {
                setDocuments([]); // No documents found for this user
            }
            setLoading(false);
        }, (error) => {
            setError(error.message); // If there's an error, show it
            setLoading(false);
        });
    }, []);

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString(); // Formats as MM/DD/YYYY, HH:mm:ss
    };

    const handleDelete = (docId) => {
        const docRef = ref(realtimeDb, `users/${auth.currentUser.uid}/documents/${docId}`);

        remove(docRef)
            .then(() => {
                setDocuments(documents.filter(doc => doc.id !== docId)); // Remove the deleted doc from state
                alert('Document deleted successfully!');
            })
            .catch((error) => {
                console.error('Error deleting document:', error);
                alert('Error deleting document.');
            });
    };

    const handleShare = (doc) => {
        const userId = auth.currentUser.uid;
        const shareableLink = `https://${process.env.REACT_APP_PROJECT_ID}.firebaseio.com/users/${userId}/documents/${doc.id}.json`;
    
        // Log or show the shareable link
        console.log('Sharing document:', doc);
        alert(`Share this link to access the document: ${shareableLink}`);
    };
    

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div>
            <h2>Documents</h2>
            {documents.length === 0 ? (
                <p>No documents found.</p>
            ) : (
                <div className='d-flex py-2 flex-wrap gap-4'>
                    {documents.map((doc) => (
                        <div className='docBox p-3 text-center bgSkyBlue rounded-3' key={doc.id}>
                            
                           <div className=" py-3 px-2 d-flex justify-content-center">
                           <div className="imgContainer bg-white py-2 rounded-3">
                           <img 
                                src={`data:image/png;base64,${doc.image}`} 
                                alt={doc.name} 
                                style={{ maxWidth: '200px', maxHeight: '200px' }} 
                                className='img-fluid'
                            />
                           </div>
                           </div>
                            
                            <div className="actionBtn d-flex align-items-center justify-content-between">
                                <p></p>
                            <p className='mb-0 fw-bold'>{doc.name}</p>
                                <img src={images.more} alt="" className='img-fluid' onClick={()=>setShow(show === doc.id ? null : doc.id)}/>
                                {show === doc.id &&   <div className="actions gap-2 justify-content-center px-3 py-2" style={show === "hide" ? {display: "none"} : {display: "flex"}}>
                            <button className='btn btn-danger' onClick={() => handleDelete(doc.id)}>Delete</button>
                            <button className='btn btn-warning' onClick={() => handleShare(doc)}>Share</button>
                            </div> }
                            </div>
                            <p className='text-end mb-2 mt-2'>{formatTimestamp(doc.createdAt)}</p>
                           
                           
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ViewDocs;
