import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Key, Building2, Menu, X } from 'lucide-react';
import { gsap } from 'gsap';
import './Navbar.css';

import logoImg from '../assets/logo.png';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => currentPath.toLowerCase() === path.toLowerCase();

  const navRef = useRef(null);
  const brandRef = useRef(null);
  const menuItemsRef = useRef([]);
  const actionBtnsRef = useRef([]);

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
    setMobileMenuOpen(false);
  }, [currentPath]);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    )
      .fromTo(
        brandRef.current,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(
        menuItemsRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(1.7)' },
        '-=0.3'
      )
      .fromTo(
        actionBtnsRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(1.5)' },
        '-=0.3'
      );
  }, []);

  return (
    <nav className="modern-navbar" ref={navRef}>
      {/* Left: Custom GS Medical Logo */}
      <div className="nav-brand" ref={brandRef}>
        <Link to="/" className="brand-link-reset" onClick={() => setMobileMenuOpen(false)}>
          <img src={logoImg} alt="GS Medical Logo" className="nav-logo-img" />
        </Link>
      </div>

      {/* Center: Desktop Pill Menu */}
      <div className="nav-menu-container">
        <ul className="nav-menu">
          <li ref={addToMenuRefs} className={isActive('/') ? 'active' : ''}>
            <Link to="/" className="menu-link-item">Home</Link>
          </li>
          <li ref={addToMenuRefs} className={isActive('/doctors') ? 'active' : ''}>
            <Link to="/doctors" className="menu-link-item">Doctors</Link>
          </li>
          <li ref={addToMenuRefs} className={isActive('/appointment') ? 'active' : ''}>
            <Link to="/appointment" className="menu-link-item">Appointments</Link>
          </li>
          <li ref={addToMenuRefs} className={isActive('/contact') ? 'active' : ''}>
            <Link to="/contact" className="menu-link-item">Contact</Link>
          </li>
        </ul>
      </div>

      {/* Right: Desktop Actions + Mobile Quick Login & Hamburger Toggle */}
      <div className="nav-actions">
        <Link
          to="/login"
          state={{ role: 'Manager', isRegister: false }}
          className="btn-outline desktop-only-btn text-decoration-none"
          ref={addToActionRefs}
        >
          <Building2 size={18} />
          <span>Hospital Admin</span>
        </Link>

        <Link
          to="/login"
          state={{ role: 'Doctor', isRegister: false }}
          className="btn-outline desktop-only-btn text-decoration-none"
          ref={addToActionRefs}
        >
          <User size={18} />
          <span>Doctor Admin</span>
        </Link>

        <Link
          to="/login"
          state={{ role: 'Patient', isRegister: false }}
          className="btn-solid text-decoration-none"
          ref={addToActionRefs}
        >
          <Key size={18} />
          <span>Login</span>
        </Link>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <ul className="mobile-nav-list">
            <li className={isActive('/') ? 'active' : ''}>
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            </li>
            <li className={isActive('/doctors') ? 'active' : ''}>
              <Link to="/doctors" onClick={() => setMobileMenuOpen(false)}>Doctors</Link>
            </li>
            <li className={isActive('/appointment') ? 'active' : ''}>
              <Link to="/appointment" onClick={() => setMobileMenuOpen(false)}>Appointments</Link>
            </li>
            <li className={isActive('/contact') ? 'active' : ''}>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            </li>
          </ul>

          <div className="mobile-drawer-actions">
            <Link
              to="/login"
              state={{ role: 'Manager', isRegister: false }}
              className="btn-outline mobile-drawer-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Building2 size={18} />
              <span>Hospital Admin</span>
            </Link>
            <Link
              to="/login"
              state={{ role: 'Doctor', isRegister: false }}
              className="btn-outline mobile-drawer-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User size={18} />
              <span>Doctor Admin</span>
            </Link>
            <Link
              to="/login"
              state={{ role: 'Patient', isRegister: false }}
              className="btn-solid mobile-drawer-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Key size={18} />
              <span>Patient</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;