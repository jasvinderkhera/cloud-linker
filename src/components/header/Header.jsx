import React, { useState } from 'react'
import './Header.css'
import {images} from '../../constant/ImagePath'

function Header() {
    const [display,setDisplay] = useState('hide')
    const toggleMenu = () =>{
        if(display === "hide"){
            setDisplay('show')
        } else{
            setDisplay("hide")
        }
    }

  return (
    <div>
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
    <div className="mobileMenu d-flex justify-content-between d-md-none">
        <img src={images.logoNew} alt="" className='img-fluid mobileLogo' />
    <img src={images.mobileMenu} alt="" className='img-fluid menuLogo' onClick={toggleMenu}/>
</div>
<div className="mobileMenuItems" style={display === "show" ? {display : "block"} : {display : "none"}}>
   <div className="menuItems mt-5">
   <a href="" className="nav-link p-3 text-white fs-5 fw-bold">Kishan UI & UX</a>
    <a href="" className="nav-link p-3 text-white fs-5 fw-bold">Contact Us</a>
    <a href="" className="nav-link p-3 text-white fs-5 fw-bold">Features</a>
   </div>
</div>
</div>
  )
}

export default Header