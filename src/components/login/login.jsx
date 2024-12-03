import React, { useState } from "react";
import "./login.css";
import { images } from "../../constant/ImagePath";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully!");
    } catch (error) {
      console.error("Login failed:", error.message);
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
            {/* <img src={images.loginPage} alt="" className='img-fluid'/> */}
          </div>
          <div className="col-md-6 my-md-1 my-5 d-flex justify-content-center align-items-center">
            <div>
              <h2 className="h1 mainBlue mb-4 text-center">
                Welcome to Cloud Linker!
              </h2>
              <p className="text-center fs-5 mb-4">
                Upload your documents in a safe and private space
              </p>
              <form action="" className="loginForm">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control mb-4 py-2 px-4"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control mb-4 py-2 px-4"
                  required
                />
              </form>
              <a href="" className="text-decoration-none text-start">
                Forgot Password?
              </a>

              <p className="text-center">
                {" "}
                <button
                  className="btn px-5 py-2 mt-3 btn-primary d-inline-block"
                  onClick={handleLogin}
                >
                  Login
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
  );
}

export default Login;
