import React, { useEffect, useState } from 'react';
import './viewDocs.css';
import { ref, onValue, remove, update } from 'firebase/database';
import { realtimeDb } from '../../../firebase/firebase';
import { auth } from '../../../firebase/firebase'; 
import { images } from '../../../constant/ImagePath';

function ViewDocs() {
    const [documents, setDocuments] = useState([]);
    const [filteredDocs, setFilteredDocs] = useState([]); // State for filtered documents
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [renameDocId, setRenameDocId] = useState(null);
    const [newName, setNewName] = useState('');


    useEffect(() => {
        const user = auth.currentUser; 
        if (!user) {
            setError('No user is logged in.');
            setLoading(false);
            return;
        }

        const userId = user.uid;
        const docRef = ref(realtimeDb, `users/${userId}/documents`);

        onValue(docRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const docs = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));
                setDocuments(docs);
                setFilteredDocs(docs); // Initialize filteredDocs
            } else {
                setDocuments([]);
                setFilteredDocs([]);
            }
            setLoading(false);
        }, (error) => {
            setError(error.message);
            setLoading(false);
        });
    }, []);

    const handleRename = (docId) => {
        if (!newName.trim()) {
            alert('Please enter a valid name.');
            return;
        }

        const docRef = ref(realtimeDb, `users/${auth.currentUser.uid}/documents/${docId}`);
        update(docRef, { name: newName })
            .then(() => {
                setDocuments(prevDocs =>
                    prevDocs.map(doc =>
                        doc.id === docId ? { ...doc, name: newName } : doc
                    )
                );
                setFilteredDocs(prevDocs =>
                    prevDocs.map(doc =>
                        doc.id === docId ? { ...doc, name: newName } : doc
                    )
                );
                setRenameDocId(null);
                setNewName('');
                alert('Document renamed successfully!');
            })
            .catch((error) => {
                console.error('Error renaming document:', error);
                alert('Error renaming document.');
            });
    };


    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const handleDelete = (docId) => {
        const docRef = ref(realtimeDb, `users/${auth.currentUser.uid}/documents/${docId}`);

        remove(docRef)
            .then(() => {
                const updatedDocs = documents.filter(doc => doc.id !== docId);
                setDocuments(updatedDocs);
                setFilteredDocs(updatedDocs); // Update filteredDocs
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
        alert(`Share this link to access the document: ${shareableLink}`);
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        // Filter documents based on the search query
        const filtered = documents.filter(doc =>
            doc.name.toLowerCase().includes(query) // Check if the name includes the query
        );
        setFilteredDocs(filtered);
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

            <div className="viewDocsInputBox mb-3">
                <img src={images.search} alt="" className='img-fluid searchIcon'/>
                <input
                    type="text"
                    placeholder="Search here"
                    className="form-control rounded-2 py-2 px-5"
                    value={searchQuery}
                    onChange={handleSearch} // Call handleSearch on input change
                />
            </div>

            {filteredDocs.length === 0 ? (
                <p>No documents found.</p>
            ) : (
                <div className="d-flex justify-content-center justify-content-md-start py-2 flex-wrap gap-4">
                    {filteredDocs.map((doc) => (
                        <div className="docBox text-center bgSkyBlue rounded-3" key={doc.id}>
                            <div className="py-2 px-2 d-flex flex-column justify-content-center">
                                <div className="actionBtn text-end mb-2 mx-2">
                                    <img
                                        src={images.more}
                                        alt=""
                                        className="img-fluid"
                                        onClick={() => setShow(show === doc.id ? null : doc.id)}
                                    />
                                    {show === doc.id && (
                                        <div className="actions gap-3 d-flex flex-md-column bg-white rounded-2 justify-content-center px-3 py-2">
                                            <img src={images.edit} alt="" className="img-fluid" onClick={() => setRenameDocId(doc.id)} />
                                            <img src={images.deleted} alt="" className="img-fluid invert" onClick={() => handleDelete(doc.id)} />
                                            <img src={images.share} alt="" className="img-fluid" onClick={() => handleShare(doc)} />
                                          
                                            
                                        </div>
                                    )}
                                </div>

                                <div className="imgContainer bg-white pb-2 mx-2 rounded-3">
                                    <img
                                        src={`data:image/png;base64,${doc.image}`}
                                        alt={doc.name}
                                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                                        className="img-fluid"
                                    />
                                </div>
                            </div>

                            <div className="d-flex mx-3 align-items-center justify-content-between">
                                {renameDocId === doc.id ? (
                                    <div className="renameInputBox d-flex">
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            placeholder="Enter new name"
                                            className="form-control"
                                        />
                                        <div>
                                        <img src={images.check} alt="" className='img-fluid checkImg' onClick={() => handleRename(doc.id)}/>
                                        <span onClick={() => setRenameDocId(null)} className='bg-white px-1 rounded-circle mt-2'>X</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="mb-0 fw-bold">{doc.name}</p>
                                )}
                            </div>
                            <p className="text-start mx-3 mb-3 mt-1">{formatTimestamp(doc.createdAt)}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ViewDocs;
























// import React, { useEffect, useState } from 'react';
// import './viewDocs.css'
// import { ref, onValue, remove } from 'firebase/database';
// import { realtimeDb } from '../../../firebase/firebase';
// import { auth } from '../../../firebase/firebase'; // Ensure you're importing auth
// import { images } from '../../../constant/ImagePath';

// function ViewDocs() {
//     const [documents, setDocuments] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [show, setShow] =useState(null)

//     useEffect(() => {
//         const user = auth.currentUser; // Get the current user from auth
//         if (!user) {
//             setError('No user is logged in.');
//             setLoading(false);
//             return;
//         }

//         const userId = user.uid;
//         const docRef = ref(realtimeDb, `users/${userId}/documents`); // Use the correct path for the user's documents

//         onValue(docRef, (snapshot) => {
//             const data = snapshot.val();
//             console.log('Fetched data:', data); // Log the data for debugging

//             if (data) {
//                 const docs = Object.keys(data).map((key) => ({
//                     id: key,
//                     ...data[key],
//                 }));
//                 setDocuments(docs);
//             } else {
//                 setDocuments([]); // No documents found for this user
//             }
//             setLoading(false);
//         }, (error) => {
//             setError(error.message); // If there's an error, show it
//             setLoading(false);
//         });
//     }, []);

//     const formatTimestamp = (timestamp) => {
//         const date = new Date(timestamp);
//         return date.toLocaleString(); // Formats as MM/DD/YYYY, HH:mm:ss
//     };

//     const handleDelete = (docId) => {
//         const docRef = ref(realtimeDb, `users/${auth.currentUser.uid}/documents/${docId}`);

//         remove(docRef)
//             .then(() => {
//                 setDocuments(documents.filter(doc => doc.id !== docId)); // Remove the deleted doc from state
//                 alert('Document deleted successfully!');
//             })
//             .catch((error) => {
//                 console.error('Error deleting document:', error);
//                 alert('Error deleting document.');
//             });
//     };

//     const handleShare = (doc) => {
//         const userId = auth.currentUser.uid;
//         const shareableLink = `https://${process.env.REACT_APP_PROJECT_ID}.firebaseio.com/users/${userId}/documents/${doc.id}.json`;
    
//         // Log or show the shareable link
//         console.log('Sharing document:', doc);
//         alert(`Share this link to access the document: ${shareableLink}`);
//     };
    

//     if (loading) {
//         return <p>Loading...</p>;
//     }

//     if (error) {
//         return <p style={{ color: 'red' }}>{error}</p>;
//     }

//     return (
//         <div>
//             <h2>Documents</h2>

//             <div className="viewDocsInputBox">
//               <input type="text" placeholder='Search here' className='form-control rounded-2 py-2 px-3' />
//               <img src="" alt="" />
//             </div>
//             {documents.length === 0 ? (
//                 <p>No documents found.</p>
//             ) : (
//                 <div className='d-flex py-2 flex-wrap gap-4'>
//                     {documents.map((doc) => (
//                         <div className='docBox p-3 text-center bgSkyBlue rounded-3' key={doc.id}>
                            
//                            <div className=" py-3 px-2 d-flex flex-column justify-content-center">
//                             <div className="actionBtn text-end mb-2 ps-2">

//                            <img src={images.more} alt="" className='img-fluid ' onClick={()=>setShow(show === doc.id ? null : doc.id)}/>
//                            {show === doc.id &&   <div className="actions gap-2 flex-column bg-white rounded-2 justify-content-center px-3 py-2" style={show === "hide" ? {display: "none"} : {display: "flex"}}>
//                             <button className='text-white rounded-2 py-1 px-3 border border-none bg-danger' onClick={() => handleDelete(doc.id)}>Delete</button>
//                             <button className='text-white rounded-2 py-1 px-3 border border-none btnColor' onClick={() => handleShare(doc)}>Share</button>
//                             </div> }
//                             </div>
                           
//                            <div className="imgContainer bg-white pb-2 rounded-3">
//                            <img 
//                                 src={`data:image/png;base64,${doc.image}`} 
//                                 alt={doc.name} 
//                                 style={{ maxWidth: '200px', maxHeight: '200px' }} 
//                                 className='img-fluid'
//                             />
//                            </div>
//                            </div>
                            
//                             <div className=" d-flex align-items-center justify-content-between">
//                                 {/* <p></p> */}
//                             <p className='mb-0 fw-bold'>{doc.name}</p>
                               
                               
//                             </div>
//                             <p className='text-start mb-3 mt-1'>{formatTimestamp(doc.createdAt)}</p>
                           
                           
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

// export default ViewDocs;
