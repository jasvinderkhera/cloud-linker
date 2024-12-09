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
import Files from '../services/files/files';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function MainPage() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState('');
  const [active,setActive] = useState('home')
  const [profilePic, setProfilePic] = useState(null);
  const [mobileMenu, setMobileMenu] = useState('hide')
  const [modalVisible, setModalVisible] = useState(false);

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

  // Modal

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

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
     <div className="container-fluid outerHeader bg-white">
     <div className="loginHeader d-flex justify-content-between align-items-center container py-2">
      <div className="logo" onClick={()=>setActive('home')}>
        <img src={images.logoNew} alt="" className='img-fluid d-none d-md-block' />
        <img src={images.mobLogo} alt="" className='img-fluid d-md-none' />
      </div>
      <div className="menuItems d-none d-md-flex gap-5" >
        <div className={active === 'home' ? "menuItem btnColor text-white border border-1 rounded-2 px-3 py-2" : "menuItem border border-1 rounded-2 px-3 py-2"} onClick={()=>setActive('home')}>
          Home
        </div>
        <div className={active === 'favourites' ? "menuItem btnColor text-white border border-1 rounded-2 px-3 py-2" : "menuItem border border-1 rounded-2 px-3 py-2"} onClick={()=>setActive('favourites')}>
        Favourites
        </div>
        <div className={active === 'plan' ? "menuItem btnColor text-white border border-1 rounded-2 px-3 py-2" : "menuItem border border-1 rounded-2 px-3 py-2"} onClick={()=>setActive('plan')}>
          Plan
        </div>
        <div className={active === 'settings' ? "menuItem btnColor text-white border border-1 rounded-2 px-3 py-2" : "menuItem border border-1 rounded-2 px-3 py-2"} onClick={()=>setActive('settings')}>
          Settings
        </div>
      </div>
      <div className="endMenu">
        <div className="mobProfile d-md-none d-block rounded-circle border border-1 overflow-hidden" onClick={()=>setActive("settings")}>
          <img src={profilePic} alt="" className='img-fluid' />
          
        </div>
        <div className="help d-md-flex d-none gap-2 border border-1 rounded-2 px-3 py-2">
        <div className="rounded-circle border border-black border-2 rounded-circle px-2"> ?</div>
        Help & Support
        </div>
      </div>
      </div>
      <hr  className='m-0 border-2 border-dark'/>
     </div>
      <div className="mainContainer container my-4">
        <div className="row">
          <div className="col-md-3 mainPageSideContainer d-none d-md-flex flex-column justify-content-between p-4 bgSkyBlue rounded-5">
           <div className="top">
           <div className="bg-white userDetails px-3 py-2 mb-5 d-flex gap-3 align-items-center rounded-3">
             <img src={profilePic} alt="" className='img-fluid profileImg rounded-circle' onClick={()=>setActive('settings')}/>
           <div>
           <p className='mb-1 fw-bold'>Welcome, {username} </p>
           <p className='mb-2'> {user.email}</p>
           </div>
            </div>
            <div>
              <div className="upload d-flex gap-3 bg-white py-3 border border-2 border-primary rounded-3 justify-content-start ps-3 align-items-center" onClick={()=>setModalVisible(true)}>
                <img src={images.upload} alt="" className='img-fluid'/>
                <p className='text-primary mb-0 fw-bold'>Upload</p>
              </div>
              <div className="upload mt-3 d-flex gap-3 bg-white py-3 border border-2 border-primary rounded-3 justify-content-start ps-3 align-items-center" onClick={()=>setActive('favourites')}>
                <img src={images.fvt} alt="" className='img-fluid'/>
                <p className='text-primary mb-0 fw-bold'>Favourites</p>
              </div>
           </div>
            </div>

            <div className="bottom">
              <p className="">
                Secure and store your documents in a safe and anytime accessible place
              </p>

            <div className="upload mt-3 d-flex gap-3 bg-white py-3 border border-2 border-primary rounded-3 justify-content-center align-items-center" onClick={()=>setActive('plan')}>
                <p className='text-primary mb-0 fw-bold'>Upgrade Your Plan</p>
              </div>
            </div>
            
          </div>
          <div className="col-md-9 col-12 mainPageContainer mt-4 mt-md-0 px-md-5 px-3 py-3">
           {active === "home" ? <ViewDocs/> : ""}
           {active === "upload" ? <UploadDoc/> : ""}
           {active === "settings" ? <Setting/> : ""}
           {active === "plan" ? <Plans/> : ""}
           {active === "favourites" ? <Files/> : ""}
           
            
          </div>
        </div>
      </div>

          <div className="mobileNavbar px-4 py-3 d-block d-md-none">
            <div className="mobNav d-flex justify-content-between">
                <div className="mobNavItem" onClick={()=>setActive('home')}>
                {active === 'home' ? <img src={images.homeActive} className='img-fluid' alt="" /> : <img src={images.home} className='img-fluid' alt="" /> }
                </div>
                <div className="mobNavItem" onClick={()=>setActive('favourites')}>
                {active === 'favourites' ? <img src={images.mobFvtActive} className='img-fluid' alt="" /> : <img src={images.mobFvt} className='img-fluid' alt="" /> }
                </div>
                <div className="mobNavItem" onClick={()=>setModalVisible(true)}>
                <img src={images.mobupldActive} className='img-fluid' alt="" />
                </div>
                <div className="mobNavItem" onClick={()=>setActive('plan')}>
                {active === 'plan' ? <img src={images.plansActive} className='img-fluid' alt="" /> : <img src={images.plans} className='img-fluid' alt="" /> }
                </div>
                <div className="mobNavItem" onClick={()=>setActive('settings')}>
                {active === 'settings' ? <img src={images.settingActive} className='img-fluid' alt="" /> : <img src={images.setting} className='img-fluid' alt="" /> }
                </div>
            </div>
          </div>

          <Modal show={modalVisible} onHide={handleCloseModal} centered>
          <Modal.Body>
          <UploadDoc/>
          </Modal.Body>
        </Modal>
    </div>
  )
}

export default MainPage