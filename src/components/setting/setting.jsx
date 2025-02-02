import React from 'react';
import { auth } from '../../firebase/firebase';
import './setting.css'
import Profile from '../profile/Profile';

function Setting() {

    const handleLogout = () => {
        auth.signOut();
      };
  return (
    <div>
        <h2>Setting</h2>
        <Profile/>

        <div className="d-flex py-4 justify-content-center align-items-center">
        <button onClick={handleLogout} className='btn btn-danger text-white '>Logout</button>
        </div>
    </div>
  )
}

export default Setting