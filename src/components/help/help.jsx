import React from 'react'
import './help.css'
import { images } from '../../constant/ImagePath'
import { Link } from 'react-router-dom'

function Help() {
  return (
    <div>
        <div className="container d-flex justify-content-between py-2">
            <div className="logo">
                <Link to={'/main-page'}><img src={images.logoNew} alt="" className='img-fluid' /></Link>
            </div>
        <div className="box"></div>
        </div>
        <div className="container my-3">
        <h4 className='text-center p-3'>Help & Support</h4>
            <p className="text-center fs-5 fw-bold">How can we help you ?</p>

            <div className="container my-5">
                <p className='text-center fs-5'>Mail us at : <a href="mailto:ankitkhera15@gmail.com" className='nav-link'>ankitkhera15@gmail.com</a></p>
            </div>
        </div>

    </div>
  )
}

export default Help