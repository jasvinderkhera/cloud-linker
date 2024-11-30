import React from 'react'
import './Header.css'
import {images} from '../../constant/ImagePath'

function Header() {
  return (
    <div className='header-outer-container d-none d-md-block'>
    <div className='center-container header py-3 px-3 d-flex justify-content-between align-items-center'>
        <div className="logo">
            <img src={images.logoNew} alt="" className='img-fluid logoImage'/>
        </div>
        <div className="menus d-flex gap-3">
            <div className="menuItem">
                <a href="" className='p-3 nav-link'>Kishan UI/UX</a>
            </div>
            <div className="menuItem">
                <a href="" className='p-3 nav-link'>Contact Us</a>
            </div>
            <div className="menuItem">
                <a href="" className='p-3 nav-link'>Features</a>
            </div>
        </div>
    </div>
    </div>
  )
}

export default Header