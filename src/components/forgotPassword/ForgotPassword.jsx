import React, { useState } from "react";
import "./ForgotPassword.css";
import { sendPasswordResetEmail } from "firebase/auth";
import {auth} from '../../firebase/firebase'
import { Link } from "react-router-dom";
import { images } from "../../constant/ImagePath";

function ForgotPassword() {
  const [resetEmail, setResetEmail] = useState("");

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert("Password reset email sent! Check your inbox.");
    } catch (error) {
      alert(error.message);
    }
  };


  return (

    <div className="forgotBtn mb-3 text-right cursor-pointer">
   
  


     <div>
      <div className="container">
        <div className="Loginlogo py-2 text-center text-md-start">
        <Link to="/"> <img src={images.logoNew} alt="" className="img-fluid" /></Link>
        </div>
        <div className="row">
          <div className="col-md-6 ellipse d-md-flex d-none justify-content-center align-items-center">
          </div>
          <div className="col-md-6 my-md-1 my-5 d-flex justify-content-center align-items-center">
            <div>
              <h2 className="h1 mainBlue mb-4 text-center">
                Don't worry reset your password 
              </h2>
              <p className="text-center fs-5 mb-4">
                Upload your documents in a safe and private space
              </p>
              <form action="" className="loginForm">
              <input
         type="email"
         placeholder="Enter your email"
         value={resetEmail}
         onChange={(e) => setResetEmail(e.target.value)}
         className='form-control px-4 rounded-full mb-8 loginInput'
       />
              </form>
             

              <p className="text-center">
                {" "}
                <button
                  className="btn px-5 py-2 mt-3 btn-primary d-inline-block"
                  onClick={handleForgotPassword} 
                >
                  Reset Password
                </button>
              </p>
              <p className="text-center d-flex justify-content-center gap-2">
                Don't have an account?{" "}
                <Link to="/register" className="nav-link text-primary">
                  {" "}
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
     </div>
  );
}

export default ForgotPassword;
