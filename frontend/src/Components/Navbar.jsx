import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Key, Building2 } from 'lucide-react'; // Removed Activity since we are using the custom logo
import { gsap } from 'gsap';
import './Navbar.css';

// Import your custom logo from the assets folder
import logoImg from '../assets/logo.png'; 

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = (path) => currentPath === path;

  // --- GSAP Animation Refs ---
  const navRef = useRef(null);
  const brandRef = useRef(null);
  const menuItemsRef = useRef([]);
  const actionBtnsRef = useRef([]);

  // Helper to push items to the ref arrays
  const addToMenuRefs = (el) => {
    if (el && !menuItemsRef.current.includes(el)) {
      menuItemsRef.current.push(el);
    }
  };
  
  const addToActionRefs = (el) => {
    if (el && !actionBtnsRef.current.includes(el)) {
      actionBtnsRef.current.push(el);
    }
  };

  useEffect(() => {
    // GSAP Timeline for a coordinated sequence
    const tl = gsap.timeline();

    // 1. Main Navbar drops down
    tl.fromTo(navRef.current, 
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    )
    // 2. Custom Logo slides in from the left
    .fromTo(brandRef.current,
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
      "-=0.4" // Overlap with previous animation by 0.4s
    )
    // 3. Center Pill Menu items stagger drop down
    .fromTo(menuItemsRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "back.out(1.7)" },
      "-=0.3"
    )
    // 4. Action buttons scale and pop in
    .fromTo(actionBtnsRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, stagger: 0.1, ease: "back.out(1.5)" },
      "-=0.3"
    );
  }, []);

  return (
    <nav className="modern-navbar" ref={navRef}>
      
      {/* Left: Custom GS Medical Logo */}
      <div className="nav-brand" ref={brandRef}>
        <Link to="/">
          <img src={logoImg} alt="GS Medical Logo" className="nav-logo-img" />
        </Link>
      </div>

      {/* Center: Pill Menu */}
      <div className="nav-menu-container">
        <ul className="nav-menu">
          <li ref={addToMenuRefs} className={isActive('/') ? 'active' : ''}>
            <Link to="/">Home</Link>
          </li>
          <li ref={addToMenuRefs} className={isActive('/schedule') ? 'active' : ''}>
            <Link to="/schedule">Doctors</Link>
          </li>
          <li ref={addToMenuRefs} className={isActive('/services') ? 'active' : ''}>
            <Link to="#services">Services</Link>
          </li>
          <li ref={addToMenuRefs} className={isActive('/appointment') ? 'active' : ''}>
            <Link to="/appointment">Appointments</Link>
          </li>
          <li ref={addToMenuRefs} className={isActive('/contact') ? 'active' : ''}>
            <Link to="#contact">Contact</Link>
          </li>
        </ul>
      </div>

      {/* Right: Actions */}
      <div className="nav-actions">
        <Link to="/login" className="btn-outline" ref={addToActionRefs}>
          <Building2 size={18} />
          <span>Hospital Admin</span>
        </Link>

        <Link to="/login" className="btn-outline" ref={addToActionRefs}>
          <User size={18} />
          <span>Doctor Admin</span>
        </Link>

        <Link to="/login" className="btn-solid" ref={addToActionRefs}>
          <Key size={18} />
          <span>Login</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;