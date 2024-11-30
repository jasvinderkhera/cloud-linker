import React from 'react'
import './login.css'
import { images } from '../../constant/ImagePath'

function Login() {
  return (
    <div>
        <div className="container">
            <div className="Loginlogo py-2">
                <img src={images.logoNew} alt="" className='img-fluid'/>
            </div>
            <div className="row">
                <div className="col-md-6 ellipse d-flex justify-content-center align-items-center">
                <img src={images.loginPage} alt="" className='img-fluid'/>
                </div>
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                  <div>
                    <h2 className='h1 mainBlue mb-4'>Welcome to Cloud Linker!</h2>
                    <p className="text-center fs-5 mb-4">The only task tracker you need.</p>
                    <form action=""></form>
                    <input type="email" placeholder='Email' className="form-control mb-4 p-2" />
                    <input type="password" placeholder='Password' className="form-control mb-4 p-2" />
                    <a href="" className='text-decoration-none'>Forgot Password?</a>

                   <p className='text-center'> <button className="btn px-5 py-2 mt-3 btn-primary d-inline-block">Login</button></p>
                  </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login