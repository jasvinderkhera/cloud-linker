import {React, useEffect, useState} from 'react'
import './mainPage.css'
import { auth, realtimeDb } from '../../firebase/firebase'; // Your Firebase auth instance
import { useAuthState } from 'react-firebase-hooks/auth';
import { ref, get } from 'firebase/database'; // Import Firebase Database methods
import UploadDoc from '../services/uploadDocs/uploadDoc';
import ViewDocs from '../services/viewDocs/viewDocs';
import { images } from '../../constant/ImagePath';
import Setting from '../setting/setting';
import Plans from '../plans/plans';

function MainPage() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState('');
  const [active,setActive] = useState('home')
  const [profilePic, setProfilePic] = useState(null);

  // console.log("active:", active)


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
      <div className="logo" onClick={()=>setActive('home')}>
        <img src={images.logoNew} alt="" className='img-fluid' />
      </div>
      <div className="menuItems d-none d-md-flex gap-5" >
        <div className={active === 'home' ? "menuItem bg-primary text-white border border-1 rounded-2 px-3 py-2" : "menuItem border border-1 rounded-2 px-3 py-2"} onClick={()=>setActive('home')}>
          Home
        </div>
        <div className={active === 'file' ? "menuItem bg-primary text-white border border-1 rounded-2 px-3 py-2" : "menuItem border border-1 rounded-2 px-3 py-2"} onClick={()=>setActive('file')}>
          File
        </div>
        <div className={active === 'plan' ? "menuItem bg-primary text-white border border-1 rounded-2 px-3 py-2" : "menuItem border border-1 rounded-2 px-3 py-2"} onClick={()=>setActive('plan')}>
          Plan
        </div>
        <div className={active === 'settings' ? "menuItem bg-primary text-white border border-1 rounded-2 px-3 py-2" : "menuItem border border-1 rounded-2 px-3 py-2"} onClick={()=>setActive('settings')}>
          Settings
        </div>
      </div>
      <div className="endMenu">
        <div className="profile rounded-circle border border-1 overflow-hidden">
          <img src={profilePic} alt="" className='img-fluid' />
          <div className='d-md-none d-block p-2' onClick={()=>setActive('upload')}></div>
        </div>
      </div>
      </div>
      <hr  className='m-0 border-2 border-dark'/>
      <div className="container my-4">
        <div className="row">
          <div className="col-md-3 mainPageContainer d-none d-md-block p-4 bgSkyBlue rounded-5">
            <div className="bg-white px-3 py-2 mb-5 text-center d-flex gap-3 align-items-center rounded-3">
             <img src={profilePic} alt="" className='img-fluid profileImg rounded-circle'/>
           <div>
           <p className='mb-2 fw-bold'>Welcome, {username} </p>
           <p className='mb-2'> {user.email}</p>
           </div>
            </div>
            <div>
              <div className="upload d-flex gap-3 bg-white py-2 border border-2 border-primary rounded-2 justify-content-center align-items-center" onClick={()=>setActive('upload')}>
                <img src={images.upload} alt="" className='img-fluid'/>
                <p className='text-primary mb-0 fw-bold'>Upload</p>
              </div>
            </div>
            
          </div>
          <div className="col-md-9 col-12 mainPageContainer px-md-5 px-3 py-3">
           {active === "home" ? <ViewDocs/> : ""}
           {active === "upload" ? <UploadDoc/> : ""}
           {active === "settings" ? <Setting/> : ""}
           {active === "plan" ? <Plans/> : ""}
           
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPage