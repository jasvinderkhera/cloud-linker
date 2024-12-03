import {React, useEffect, useState} from 'react'
import './mainPage.css'
import { auth, realtimeDb } from '../../firebase/firebase'; // Your Firebase auth instance
import { useAuthState } from 'react-firebase-hooks/auth';
import { ref, get } from 'firebase/database'; // Import Firebase Database methods
import UploadDoc from '../services/uploadDocs/uploadDoc';
import ViewDocs from '../services/viewDocs/viewDocs';
import { images } from '../../constant/ImagePath';

function MainPage() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      if (user) {
        const userRef = ref(realtimeDb, `users/${user.uid}/username`); // Path to the username
        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setUsername(snapshot.val()); // Set the username state
          } else {
            console.log('Username not found.');
          }
        } catch (error) {
          console.error('Error fetching username:', error);
        }
      }
    };

    fetchUsername();
  }, [user]);

  return (
    <div>
      <div className="loginHeader d-flex justify-content-between align-items-center container py-3">
      <div className="logo">
        <img src={images.logoNew} alt="" className='img-fluid' />
      </div>
      <div className="menuItems d-flex gap-5">
        <div className="menuItem border border-1 rounded-2 px-3 py-2">
          Home
        </div>
        <div className="menuItem border border-1 rounded-2 px-3 py-2">
          File
        </div>
        <div className="menuItem border border-1 rounded-2 px-3 py-2">
          Plan
        </div>
        <div className="menuItem border border-1 rounded-2 px-3 py-2">
          Settings
        </div>
      </div>
      <div className="endMenu">
        <div className="profile rounded-circle border border-1">
          <img src={images.user} alt="" className='img-fluid' />
        </div>
      </div>
      </div>
      <div className="container my-4">
        <div className="row">
          <div className="col-md-3 mainPageContainer p-4 bgSkyBlue rounded-5">
            <div className="bg-white p-3 mb-5 text-center d-flex rounded-3 gap-3 align-items-center">
             <img src={images.user} alt="" className='img-fluid profileImg'/>
           <div>
           <p className='mb-2 fw-bold'>Welcome, {username} </p>
           <p className='mb-2'> {user.email}</p>
           </div>
            </div>

            <UploadDoc/>
          </div>
          <div className="col-md-9 mainPageContainer px-5 py-3">
            <div className="inputBox">
              <input type="text" placeholder='Search here' className='form-control rounded-2 py-2 px-3' />
              <img src="" alt="" />
            </div>
            <ViewDocs/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPage