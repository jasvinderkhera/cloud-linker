import React from "react";
import "./Homepage.css";
import { images } from "../../constant/ImagePath";
import { Link } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import how from '../../assets/images/how.mp4'

function Homepage() {
  return (
    
    <div className="homepage ">
      <Header/>
      <div className="topContainer d-flex flex-column-reverse flex-md-row">
        <div className="leftCircle d-flex flex-column justify-content-center align-items-center">
          <div className="welcome">
            <p className="welcomeDialogue">Welcome to Cloud Linker</p>
          </div>
          <div className="details">
            <p>
              Welcome to Cloud Linker, your secure and easy-to-use platform for
              uploading and sharing documents with ease. Whether you're a
              professional, a student, or just someone who needs to manage files
              efficiently, we’re here to help you organize, share, and
              collaborate seamlessly.
            </p>
          </div>
          <div className="actionButtons d-flex gap-3 pt-3">
            <div className="login">
              <Link className="px-5 py-2 nav-link" to={'/login'}>Login</Link>
            </div>
            <div className="signup">
              <Link className="px-5 py-2 nav-link" to={'/register'}>Register</Link>
            </div>
          </div>
        </div>
        <div className="rightCircle">
          <img src={images.vector1} alt="" />
        </div>
      </div>
      <div className="features d-flex flex-column-reverse flex-md-row gap-5 my-5 container" id="features">
        <div className="featureBox1">
          <div className="featuretitle d-none d-md-block text-md-center text-start mb-5">
            <p>Features</p>
          </div>
          <div className="featuresList">
            <ul>
              <li className="d-flex align-items-start mb-3">
                Secure Document Uploads: Upload your documents in a safe and
                private environment. Our platform ensures that your files are
                encrypted and protected.
              </li>
              <li className="d-flex align-items-start mb-3">
                Easy Sharing: Share your documents with friends, colleagues, or
                clients instantly, whether via email, direct link, or within a
                specific group.
              </li>
              <li className="d-flex align-items-start mb-3">
                Organized Storage: Keep your files neatly organized with
                folders, tags, and search features, so you can always find what
                you need when you need it.
              </li>
              <li className="d-flex align-items-start mb-3">
                Access Anywhere: Your documents are accessible from any device,
                anywhere, at any time—perfect for work, study, or personal use.
              </li>
            </ul>
          </div>
        </div>
        <div className="featureBox2">
        <div className="featuretitle d-block d-md-none text-md-center text-start mt-5">
            <p>Features</p>
          </div>
          <img src={images.vector2} alt="" className="img-fluid"/>
        </div>
      </div>
      <div className="choose d-flex flex-column flex-md-row gap-md-5 gap-3 my-5 container">
        <div className="chooseBox2">
        <div className="featuretitle d-block d-md-none text-center mb-2">
            <p>Why Choose Us ?</p>
          </div>
          <img src={images.vector3} alt="" className="img-fluid"/>
        </div>
        <div className="chooseBox1">
          <div className="featuretitle d-none d-md-block text-center mb-5">
            <p>Why Choose Us ?</p>
          </div>
          <div className="featuresList">
            <ul className="pe-4">
              <li className="d-flex align-items-start mb-3">
                Simplicity: No complicated software or confusing steps—just
                upload, share, and go.
              </li>
              <li className="d-flex align-items-start mb-3">
                Security: We take your privacy seriously, employing
                industry-standard encryption and secure storage.
              </li>
              <li className="d-flex align-items-start mb-3">
                Collaboration: Whether for work or personal projects,
                collaborate on documents with ease.
              </li>
              <li className="d-flex align-items-start mb-3">
                Get Started Today! <br /> Ready to start sharing and storing your
                documents in a secure and efficient way? Sign up now to unlock
                all the features and start managing your documents with ease.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="works d-flex flex-column-reverse flex-md-row gap-5 my-5 container">
        <div className="workBox1">
          <div className="featuretitle d-none d-md-block text-center mb-md-5">
            <p>How it Works</p>
          </div>
          <div className="workList">
            <ol>
              <li className="d-flex align-items-start  mb-3">
              1. Sign Up / Log In: Create an account or log into your existing one to get started.
              </li>
              <li className="d-flex align-items-start  mb-3">
              2. Upload Documents: Simply drag and drop your files into our easy-to-use uploader.
              </li>
              <li className="d-flex align-items-start  mb-3">
              3. Share with Ease: Once your documents are uploaded, share them instantly via email, link, or with specific users.
              </li>
              <li className="d-flex align-items-start  mb-3">
              4. Stay Secure: We ensure the privacy and protection of your data with top-notch encryption methods.
              </li>
            </ol>
          </div>
        </div>
        <div className="workBox2">
        <div className="featuretitle d-block d-md-none text-center mb-3">
            <p>How it Works</p>
          </div>
          <div className="videoBox bg-black mx-5 h-100 rounded-5 overflow-hidden">
            <video src={how} className="img-fluid" muted autoPlay loop></video>
          </div>
        </div>
        
      </div>
      <div className="playstore">
            <h2 className="fs-1 text-center fw-bold">Now available in Play Store</h2>
        </div>
        <div className="works d-flex flex-column-reverse flex-md-row gap-5 my-5 container">
        <div className="workBox1 d-flex justify-content-around align-items-center flex-column">
          <div className="download fs-1 text-center">
            <p className="p-3">Download Now</p>
          </div>
          <div className="workList text-center">
            <a href="" className="nav-link px-5 py-2 bg-primary d-inline-block text-white rounded-3 fw-bold fs-5">Download App</a>
          </div>
        </div>
        <div className="workBox2">
          <div className="videoBox bg-dark mx-5 h-100 rounded-5">
            <img src={images.play} alt="" className="img-fluid h-100"/>
          </div>
        </div>
        
      </div>
      <Footer/>
    </div>
  );
}

export default Homepage;
