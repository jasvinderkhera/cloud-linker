import React from 'react'
import './mainPage.css'
import { auth } from '../../firebase/firebase'; // Your Firebase auth instance
import { useAuthState } from 'react-firebase-hooks/auth';
import UploadDoc from '../services/uploadDocs/uploadDoc';
import ViewDocs from '../services/viewDocs/viewDocs';
import { images } from '../../constant/ImagePath';

function MainPage() {
  const [user] = useAuthState(auth);
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
        <div className="profile rounded-circle border border-black border-1">
          <img src="" alt="" />
        </div>
      </div>
      </div>
      <div className="container my-4">
        <div className="row">
          <div className="col-md-3 mainPageContainer py bgSkyBlue rounded-5">

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