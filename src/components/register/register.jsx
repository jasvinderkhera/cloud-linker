import "./register.css";
import { images } from "../../constant/ImagePath";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, realtimeDb } from '../../firebase/firebase';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
   if(password === confirmPassword){
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save username in Realtime Database
      await set(ref(realtimeDb, `users/${user.uid}`), {
          username: username,
          email: user.email,
      });

      alert('Account created successfully!');
  } catch (error) {
      console.error('Registration failed:', error.message);
      alert(error.message);
  }
   } else{
    return
   }
  };
  return (
    <div>
      <div className="container">
        <div className="Loginlogo py-2 text-center text-md-start">
          <img src={images.logoNew} alt="" className="img-fluid" />
        </div>
        <div className="row">
          <div className="col-md-6 ellipse d-md-flex d-none justify-content-center align-items-center">
          </div>

          <div className="col-md-6 my-md-1 my-5 d-flex justify-content-center align-items-center">
            <div>
              <h2 className="h1 mainBlue mb-4 text-center">
                Welcome to Cloud Linker!
              </h2>
              <p className="text-center fs-5 mb-4">
                Upload your documents in a safe and private space
              </p>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-control mb-4 p-2"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control mb-4 p-2"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control mb-4 p-2"
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control mb-4 p-2"
                required
              />
              <a href="" className="text-decoration-none">
                Forgot Password?
              </a>

              <p className="text-center">
                {" "}
                <button onClick={handleRegister} className="btn px-5 py-2 mt-3 btn-primary d-inline-block">
                  Register
                </button>
              </p>
              <p className="text-center d-flex justify-content-center gap-2">
                Already have an account?{" "}
                <Link to="/login" className="nav-link text-primary">
                  {" "}
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
