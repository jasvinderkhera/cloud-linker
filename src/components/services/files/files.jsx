import React, { useEffect, useState } from 'react';
import './files.css'
import { ref, onValue, remove, update } from 'firebase/database';
import { realtimeDb } from '../../../firebase/firebase';
import { auth } from '../../../firebase/firebase'; 
import { images } from '../../../constant/ImagePath';


function Files() {
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
                            <DocumentCard
                                key={doc.id}
                                doc={doc}
                                handleToggleFavourite={handleToggleFavourite}
                                setShow={setShow}
                                show={show}
                               
                            />
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
                            <DocumentCard
                                key={doc.id}
                                doc={doc}
                                handleToggleFavourite={handleToggleFavourite}
                                setShow={setShow}
                                show={show}
                               
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function DocumentCard({ doc, handleToggleFavourite, setShow, show }) {
    return (
        <div className="docBox text-center columnColor rounded-3" key={doc.id}>
            <div className="py-2 px-2 d-flex flex-column justify-content-center">
                <div className="actionBtn d-flex justify-content-between align-items-center mb-2 mx-2">
                    <button
                        className={`btn ${doc.favourite ? 'btn-danger ' : 'btn-outline-secondary '}`}
                        onClick={() => handleToggleFavourite(doc.id, doc.favourite)}
                    >
                        <img src={images.heart} className="img-fluid" />
                    </button>
                    <img
                        src={images.more}
                        alt=""
                        className="img-fluid"
                        onClick={() => setShow(show === doc.id ? null : doc.id)}
                    />
                    {show === doc.id && (
                        <div className="actions gap-3 d-flex flex-md-column rounded-2 justify-content-center px-2 py-2">
                            {/* Actions */}
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
            <p className="mb-0 fw-bold">{doc.name}</p>
        </div>
    );
}

export default Files;
