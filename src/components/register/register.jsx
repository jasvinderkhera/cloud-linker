import React from 'react'
import './register.css'
import { images } from '../../constant/ImagePath'
import { Link } from 'react-router-dom'

function Register() {
  return (
    <div>
    <div className="container">
        <div className="Loginlogo py-2 text-center text-md-start">
            <img src={images.logoNew} alt="" className='img-fluid'/>
        </div>
        <div className="row">
            <div className="col-md-6 ellipse d-md-flex d-none justify-content-center align-items-center">
            <img src={images.loginPage} alt="" className='img-fluid'/>
            </div>
            <div className="col-md-6 my-md-1 my-5 d-flex justify-content-center align-items-center">
              <div>
                <h2 className='h1 mainBlue mb-4 text-center'>Welcome to Cloud Linker!</h2>
                <p className="text-center fs-5 mb-4">Upload your documents in a safe and private space</p>
                <form action=""></form>
                <input type="username" placeholder='Username' className="form-control mb-4 p-2" />
                <input type="email" placeholder='Email' className="form-control mb-4 p-2" />
                <input type="password" placeholder='Password' className="form-control mb-4 p-2" />
                <input type="password" placeholder='Confirm Password' className="form-control mb-4 p-2" />
                <a href="" className='text-decoration-none'>Forgot Password?</a>

               <p className='text-center'> <button className="btn px-5 py-2 mt-3 btn-primary d-inline-block">Register</button></p>
               <p className="text-center d-flex justify-content-center gap-2">Already have an account? <Link to='/login' className='nav-link text-primary'> Sign in</Link></p>
              </div>
            </div>
        </div>
    </div>
</div>
  )
}

export default Register