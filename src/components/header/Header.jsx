import React, { useState } from 'react'
import './Header.css'
import {images} from '../../constant/ImagePath'
import { Link } from 'react-router-dom'

function Header() {
    const [display,setDisplay] = useState('hide')
    const toggleMenu = () =>{
        if(display === "hide"){
            setDisplay('show')
            document.body.classList.add('modal-open')
        } else{
            document.body.classList.remove('modal-open')
            setDisplay("hide")
        }
    }

  return (
    <div>
    <div className='header-outer-container d-none d-md-block'>
    <div className='center-container header py-3 px-3 d-flex justify-content-between align-items-center'>
        <div className="logo">
            <Link to="/" className="nav-link"><img src={images.logoNew} alt="" className='img-fluid logoImage'/></Link>
        </div>
        <div className="menus d-flex gap-3">
            
            <div className="menuItem">
                <Link to="/contact" className='p-3 nav-link'>Contact Us</Link>
            </div>
            <div className="menuItem">
                <a href="#features" className='p-3 nav-link'>Features</a>
            </div>
        </div>
        
    </div>
    </div>
    <div className="homepage_mobileMenu d-flex justify-content-between d-md-none">
        <img src={images.logoNew} alt="" className='img-fluid mobileLogo' />
    <img src={images.mobileMenu} alt="" className='img-fluid menuLogo' onClick={toggleMenu}/>
</div>
<div className="mobileMenuItems" style={display === "show" ? {display : "block"} : {display : "none"}}>
   <div className="menuItems mt-5">
    <Link to='/contact' className="nav-link p-3 text-white fs-5 fw-bold">Contact Us</Link>
    <Link to='#features' className="nav-link p-3 text-white fs-5 fw-bold">Features</Link>
   </div>
</div>
</div>
  )
}

export default Header