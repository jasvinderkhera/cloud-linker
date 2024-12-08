import React, { useEffect, useState } from 'react';
import './files.css'
import { ref, onValue, remove, update } from 'firebase/database';
import { realtimeDb } from '../../../firebase/firebase';
import { auth } from '../../../firebase/firebase'; 
import { images } from '../../../constant/ImagePath';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";


function Files() {
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




      // Modal

      const handleOpenModal = (doc) => {
        setSelectedDoc(doc);
        setModalVisible(true);
      };
    
      const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedDoc(null);
      };




      // Convert time to IST

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
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
        const userId = auth.currentUser.uid;
        const shareableLink = `https://${process.env.REACT_APP_PROJECT_ID}.firebaseio.com/users/${userId}/documents/${doc.id}.json`;
        alert(`Share this link to access the document: ${shareableLink}`);
    };

    const handleToggleFavourite = (docId, isFavourite) => {
        const docRef = ref(realtimeDb, `users/${auth.currentUser.uid}/documents/${docId}`);

        update(docRef, { favourite: !isFavourite })
            .then(() => {
                setDocuments((prevDocs) =>
                    prevDocs.map((doc) =>
                        doc.id === docId ? { ...doc, favourite: !isFavourite } : doc
                    )
                );
                setFilteredDocs((prevDocs) =>
                    prevDocs.map((doc) =>
                        doc.id === docId ? { ...doc, favourite: !isFavourite } : doc
                    )
                );
            })
            .catch((error) => {
                console.error('Error updating favourite status:', error);
                alert('Error updating favourite status.');
            });
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = documents.filter((doc) =>
            doc.name.toLowerCase().includes(query)
        );
        setFilteredDocs(filtered);
    };

    const favouriteDocs = filteredDocs.filter((doc) => doc.favourite);
    const allDocs = filteredDocs;

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div>
            <div className="viewDocsInputBox mb-3">
                <div className="searchOverlay mt-2 mt-md-0">
                    <img src={images.search} alt="" className="img-fluid searchIcon" />
                    <input
                        type="text"
                        placeholder="Search here"
                        className="form-control rounded-4 py-2 px-5 border-2"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            {/* Favourite Documents */}
            <div>
                <h2 className="mt-4">Favourite Documents</h2>
                {favouriteDocs.length === 0 ? (
                    <p>No favourite documents found.</p>
                ) : (
                    <div className="d-flex justify-content-center justify-content-md-start py-2 flex-wrap gap-4">
                    {favouriteDocs.map((doc) => (
                        <div className="docBox text-center columnColor rounded-3" key={doc.id} onClick={() => handleOpenModal(doc)}>
                            <div className="py-2 px-2 d-flex flex-column justify-content-center">
                               
                                <div className="actionBtn d-flex justify-content-between align-items-center mb-2 mx-2">
                                <button
                                    className={`btn ${doc.favourite ? 'btn-danger ' : 'btn-outline-secondary '}`}
                                    onClick={() => handleToggleFavourite(doc.id, doc.favourite)}
                                >
                                    {<img src={images.heart} className="img-fluid"/>}
                                </button>
                                    <img
                                        src={images.more}
                                        alt=""
                                        className="img-fluid"
                                        onClick={() => setShow(show === doc.id ? null : doc.id)}
                                    />
                                    {show === doc.id && (
                                        <div className="actions gap-3 d-flex flex-md-column rounded-2 justify-content-center px-2 py-2">
                                            <div className='d-flex gap-2' onClick={() => setRenameDocId(doc.id)} ><img src={images.edit} alt="" className="img-fluid" /><span className='px-1'>Edit</span></div>
                                            <div className='d-flex gap-2' onClick={() => handleDelete(doc.id)}><img src={images.deleted} alt="" className="img-fluid invert"  /><span className='px-1'>Delete</span></div>
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
            </div>

            {/* All Documents */}
            <div>
                <h2 className="mt-4">All Documents</h2>
                {allDocs.length === 0 ? (
                    <p>No documents found.</p>
                ) : (
                    <div className="d-flex justify-content-center justify-content-md-start py-2 flex-wrap gap-4">
                        {allDocs.map((doc) => (
                            <div className="docBox text-center columnColor rounded-3" key={doc.id} onClick={() => handleOpenModal(doc)}>
                                <div className="py-2 px-2 d-flex flex-column justify-content-center">
                                   
                                    <div className="actionBtn d-flex justify-content-between align-items-center mb-2 mx-2">
                                    <button
                                        className={`btn ${doc.favourite ? 'btn-danger ' : 'btn-outline-secondary '}`}
                                        onClick={() => handleToggleFavourite(doc.id, doc.favourite)}
                                    >
                                        {<img src={images.heart} className="img-fluid"/>}
                                    </button>
                                        <img
                                            src={images.more}
                                            alt=""
                                            className="img-fluid"
                                            onClick={() => setShow(show === doc.id ? null : doc.id)}
                                        />
                                        {show === doc.id && (
                                            <div className="actions gap-3 d-flex flex-md-column rounded-2 justify-content-center px-2 py-2">
                                                <div className='d-flex gap-2' onClick={() => setRenameDocId(doc.id)} ><img src={images.edit} alt="" className="img-fluid" /><span className='px-1'>Edit</span></div>
                                                <div className='d-flex gap-2' onClick={() => handleDelete(doc.id)}><img src={images.deleted} alt="" className="img-fluid invert"  /><span className='px-1'>Delete</span></div>
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
            </div>

            
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
              <Button onClick={() => handleRename(selectedDoc.id)}>
                Rename
              </Button>
              <Button className='btn btn-danger' onClick={() => handleDelete(selectedDoc.id)}>
                Delete
              </Button>
              <Button className='btn btn-info' onClick={() => handleToggleFavourite(selectedDoc.id)}>
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

export default Files;