import React from 'react';
import { Link } from 'react-router-dom';
// Standard UI icons from Lucide
import { Phone, Mail, MapPin, ArrowRight, Send, ChevronUp } from 'lucide-react';
// Brand icons from React-Icons (Feather style to match Lucide)
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiYoutube } from 'react-icons/fi';

import logoImg from '../assets/logo.png'; 
import './Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-wrapper">
      
      <div className="footer-top">
        
        {/* Column 1: Brand & Contact */}
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <img src={logoImg} alt="GS Healthcare" className="footer-logo-img" />
            <div className="brand-text">
              <h3>GS Healthcare</h3>
              <p>Healthcare Solutions</p>
            </div>
          </div>
          <p className="brand-desc">
            Your trusted partner in healthcare innovation. We're committed to providing exceptional medical care with cutting-edge technology and compassionate service.
          </p>
          <div className="contact-info">
            <div className="contact-item">
              <span className="icon-circle"><Phone size={16} /></span>
              <span>+91 1234567889</span>
            </div>
            <div className="contact-item">
              <span className="icon-circle"><Mail size={16} /></span>
              <span>gsmedicalservices@gmail.com</span>
            </div>
            <div className="contact-item">
              <span className="icon-circle"><MapPin size={16} /></span>
              <span>Odisha, India</span>
            </div>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="footer-col links-col">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <Link to="/">
                <span className="icon-circle-small"><ArrowRight size={14} /></span> Home
              </Link>
            </li>
            <li>
              <Link to="/schedule">
                <span className="icon-circle-small"><ArrowRight size={14} /></span> Doctors
              </Link>
            </li>
            {/* <li>
              <Link to="#services">
                <span className="icon-circle-small"><ArrowRight size={14} /></span> Services
              </Link>
            </li> */}
            <li >
              <Link to="/Contact">
                <span className="icon-circle-small"><ArrowRight size={14} /></span> Contact
              </Link>
            </li>
            <li>
              <Link to="/appointment">
                <span className="icon-circle-small"><ArrowRight size={14} /></span> Appointments
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Our Services */}
        <div className="footer-col services-col">
          <h4>Our Services</h4>
          <ul>
            <li><span className="dot"></span> Blood Pressure Check</li>
            <li><span className="dot"></span> Blood Sugar Test</li>
            <li><span className="dot"></span> Full Blood Count</li>
            <li><span className="dot"></span> X-Ray Scan</li>
            <li><span className="dot"></span> Medical Checkup</li>
          </ul>
        </div>

        {/* Column 4: Stay Connected & Newsletter */}
        <div className="footer-col connect-col">
          <h4>Stay Connected</h4>
          <p>Subscribe for health tips, medical updates, and wellness insights delivered to your inbox.</p>
          <div className="subscribe-box">
            <input type="email" placeholder="Enter your email" />
            <button type="button">
              <Send size={16} /> Subscribe
            </button>
          </div>
          <div className="social-icons">
            {/* Using the newly imported react-icons here */}
            <a href="#!"><FiFacebook size={20} /></a>
            <a href="#!"><FiTwitter size={20} /></a>
            <a href="#!"><FiInstagram size={20} /></a>
            <a href="#!"><FiLinkedin size={20} /></a>
            <a href="#!"><FiYoutube size={20} /></a>
          </div>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="footer-bottom">
        <p>© 2026 GS Healthcare.</p>
        <p>Designed by <strong>Hexagon Digital Services</strong></p>
        <button className="scroll-top-btn" onClick={scrollToTop} aria-label="Scroll to top">
          <ChevronUp size={24} />
        </button>
      </div>
      
    </footer>
  );
};

export default Footer;