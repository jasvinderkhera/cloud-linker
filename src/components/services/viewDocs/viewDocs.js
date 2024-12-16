import React, { useEffect, useState } from 'react';
import './viewDocs.css';
import { ref, onValue, remove, update } from 'firebase/database';
import { realtimeDb } from '../../../firebase/firebase';
import { auth } from '../../../firebase/firebase'; 
import { images } from '../../../constant/ImagePath';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function ViewDocs() {
    const [documents, setDocuments] = useState([]);
    const [filteredDocs, setFilteredDocs] = useState([]); // State for filtered documents
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [renameDocId, setRenameDocId] = useState(null);
    const [newName, setNewName] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);


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


    // Rename

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


    // Favourties


    const handleToggleFavourite = (docId, isFavourite) => {
        const docRef = ref(realtimeDb, `users/${auth.currentUser.uid}/documents/${docId}`);

        update(docRef, { favourite: !isFavourite })
            .then(() => {
                setDocuments(prevDocs =>
                    prevDocs.map(doc =>
                        doc.id === docId ? { ...doc, favourite: !isFavourite } : doc
                    )
                );
                setFilteredDocs(prevDocs =>
                    prevDocs.map(doc =>
                        doc.id === docId ? { ...doc, favourite: !isFavourite } : doc
                    )
                );
            })
            .catch((error) => {
                console.error('Error updating favourite status:', error);
                alert('Error updating favourite status.');
            });
    };

// Convert time to IST

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };


    // Modal

    const handleOpenModal = (doc) => {
        setSelectedDoc(doc);
        setModalVisible(true);
      };
    
      const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedDoc(null);
      };



    // Delete

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


    // Share

    const handleShare = (doc) => {
        if (!doc.image) {
            alert("Invalid or missing image data.");
            return;
        }
    
        try {
            const blob = base64ToBlob(doc.image);
            const file = new File([blob], `${doc.name}.png`, { type: "image/png" });
    
            if (navigator.share) {
                navigator.share({
                    title: doc.name,
                    text: `Check out this document: ${doc.name}`,
                    files: [file],
                })
                    .then(() => console.log("Document shared successfully"))
                    .catch((error) => console.error("Error sharing document:", error));
            } else {
                alert("Sharing is not supported in your browser.");
            }
        } catch (error) {
            console.error("Error sharing document:", error.message);
            alert("Failed to share the document.");
        }
    };

    // Base to blob

    const base64ToBlob = (base64) => {
        // Add prefix if missing
        if (!base64.startsWith("data:image")) {
            base64 = `data:image/png;base64,${base64}`;
        }
    
        // Split into prefix and actual Base64 data
        const [prefix, base64Data] = base64.split(",");
        if (!base64Data) {
            throw new Error("Invalid Base64 string");
        }
    
        // Decode Base64 and create a Blob
        const binary = atob(base64Data);
        const array = [];
        for (let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], { type: prefix.split(":")[1].split(";")[0] });
    };
    
    
    
    


    // Search

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

            <div className="viewDocsInputBox">
               <div className="searchOverlay py-3 ps-2 pe-4 bg-white">
               <img src={images.search} alt="" className='img-fluid searchIcon'/>
                <input
                    type="text"
                    placeholder="Search here"
                    className="form-control rounded-4 py-2 px-5 border-2"
                    value={searchQuery}
                    onChange={handleSearch} // Call handleSearch on input change
                    />
               </div>
            </div>
                    <h2 className='mt-4 ms-3 ms-md-0'>Documents</h2>

            {filteredDocs.length === 0 ? (
                <p>No documents found.</p>
            ) : (
                <div className="d-flex justify-content-center justify-content-md-start py-2 flex-wrap gap-4">
                    {filteredDocs.map((doc) => (
                        <div className="docBox text-center columnColor rounded-3" key={doc.id} >
                            <div className="py-2 px-2 d-flex flex-column justify-content-center">
                               
                                <div className="actionBtn d-flex justify-content-between align-items-center mb-2 mx-2">
                                <div onClick={() => handleToggleFavourite(doc.id, doc.favourite)}>
  {doc.favourite ? (
    <img src={images.fvt} className="img-fluid" alt="Favorite" />
  ) : (
    <img src={images.unfvt} className="img-fluid" alt="Not Favorite" />
  )}
</div>
                                    <img
                                        src={images.more}
                                        alt=""
                                        className="img-fluid"
                                        onClick={() => setShow(show === doc.id ? null : doc.id)}
                                    />
                                    {show === doc.id && (
                                        <div className="actions gap-3 d-flex flex-md-column rounded-2 justify-content-center px-2 py-2">
                                            <div className='d-flex gap-2' onClick={() => setRenameDocId(doc.id)} ><img src={images.edit} alt="" className="img-fluid" /><span className='px-1'>Edit</span></div>
                                            <div className='d-flex gap-2' onClick={() => setConfirmDelete(true)}><img src={images.deleted} alt="" className="img-fluid invert"  /><span className='px-1'>Delete</span>
                                            <div className={confirmDelete == true ? 'confirm d-flex flex-column p-4 rounded-2' : "confirm d-none p-4 rounded-2"}>
                                                <p className="text-center px-3">Are you sure you want to delete ?</p>
                                                <div className="d-flex justify-content-center gap-4">
                                                    <div className='btn btn-danger' onClick={ () => { setConfirmDelete(false)}}>Delete</div>
                                                    <div className='btn btn-info' onClick={()=>{setConfirmDelete(false); console.log(confirmDelete)}}>Cancel</div>
                                                </div>
                                                </div>
                                            </div>

                                            <div className='d-flex gap-2' onClick={() => handleShare(doc)}><img src={images.share} alt="" className="img-fluid"  /><span className='px-1'>Share</span></div>
                                          
                                            
                                        </div>
                                    )}
                                </div>

                                <div className="imgContainer bg-white pb-2 mx-2 rounded-3">
                                    <img
                                        src={`data:image/png;base64,${doc.image}`}
                                        alt={doc.name}
                                        style={{ maxHeight: '200px' }}
                                        className="img-fluid"
                                        onClick={() => handleOpenModal(doc)}
                                    />
                                </div>
                            </div>

                            <div className="d-flex mx-3 align-items-center justify-content-between">
                                {renameDocId === doc.id ? (
                                    <div className="renameInputBox d-flex align-items-center">
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            placeholder="Enter new name"
                                            className="form-control"
                                        />
                                        <div>
                                        <img src={images.check2} alt="" className='img-fluid checkImg' onClick={() => handleRename(doc.id)}/>
                                        <img src={images.close} alt="" className='img-fluid checkImg' onClick={() => setRenameDocId(null)}/>
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


{selectedDoc && (
        <Modal show={modalVisible} onHide={handleCloseModal} centered>
          <Modal.Body>
            <img
              src={`data:image/png;base64,${selectedDoc.image}`}
              alt={selectedDoc.name}
              className="img-fluid modalImg"
            />
            <p className='fw-bold py-2'>{selectedDoc.name}</p>
            <div className="d-flex justify-content-around mt-3">
              <Button className='btn-success' onClick={() => handleRename(selectedDoc.id)}>
                Rename
              </Button>
              <Button className='btn btn-danger' onClick={() => setConfirmDelete('show')}>
                Delete
                <div className={confirmDelete === "show" ? 'modalConfirm d-flex flex-column p-4 rounded-2' : "modalConfirm d-none p-4 rounded-2"}>
                                                <p className="text-center text-black px-3">Are you sure you want to delete ?</p>
                                                <div className="d-flex justify-content-center gap-4">
                                                    <div className='btn btn-danger' onClick={ () =>{handleDelete(selectedDoc.id); setConfirmDelete('hide')}}>Delete</div>
                                                    <div className='btn btn-info' onClick={()=>{ setConfirmDelete('hide');console.log(confirmDelete)}}>Cancel</div>
                                                </div>
                                                </div>
              </Button>
              <Button className='btn btn-primary' onClick={() => handleToggleFavourite(selectedDoc.id)}>
                Favourite
              </Button>
              <Button className='btn-warning' onClick={() => handleShare(selectedDoc)}>Share</Button>
            </div>
          </Modal.Body>
        </Modal>
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
