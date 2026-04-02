import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Imported Link for routing
import { gsap } from 'gsap'; // Imported GSAP for animations
import './Home.css';

import { Stethoscope, Star, UserCheck, Clock, ShieldCheck, Users, Calendar, Phone } from 'lucide-react'; 

import hospitalImg from '../../assets/hospitalimg.png'; 

const Home = () => {
  // Refs for GSAP animations
  const contentRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    // GSAP Timeline to stagger the hero section animations smoothly
    const tl = gsap.timeline({ delay: 0.2 }); // Slight delay to let the Navbar animate first

    // Animate the left-side text content (cascading up)
    tl.fromTo(contentRef.current.children,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power2.out" }
    )
    // Animate the hero image (sliding in from the right with a slight scale)
    .fromTo(imageRef.current,
      { x: 50, opacity: 0, scale: 0.95 },
      { x: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" },
      "-=0.5" // This makes the image start animating slightly before the text finishes
    );
  }, []);

  return (
    <section className="home-hero-container">
      
      {/* Left Content Area attached to contentRef for animation */}
      <div className="hero-content" ref={contentRef}>
        
        <div className="logo-section">
          <div className="icon-circle">
            <Stethoscope size={24} color="#ffffff" />
          </div>
          <h1 className="brand-title">GS Healthcare</h1>
        </div>

        <div className="rating-section">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={18} fill="#fbbf24" color="#fbbf24" className="star-icon" />
          ))}
        </div>

        <h2 className="hero-tagline">
          Premium Healthcare <br /> At Your Fingertips
        </h2>

        <div className="feature-tags-container">
          <div className="tag-row">
            <div className="feature-pill green-pill">
              <UserCheck size={16} className="pill-icon" />
              <span>Certified Specialists</span>
            </div>
            <div className="feature-pill green-pill">
              <Clock size={16} className="pill-icon" />
              <span>24/7 Availability</span>
            </div>
          </div>
          <div className="tag-row">
            <div className="feature-pill green-pill">
              <ShieldCheck size={16} className="pill-icon" />
              <span>Safe & Secure</span>
            </div>
            <div className="feature-pill green-pill">
              <Users size={16} className="pill-icon" />
              <span>500+ Doctors</span>
            </div>
          </div>
        </div>

        <div className="hero-buttons-container">
          {/* UPDATED: Changed from <button> to <Link> to enable routing */}
          <Link to="/appointment" className="btn-primary-green" style={{ textDecoration: 'none' }}>
            <Calendar size={18} className="btn-icon" />
            Book Appointment Now
          </Link>
          
          <button className="btn-primary-red">
            <Phone size={18} className="btn-icon" />
            Emergency Call
          </button>
        </div>
      </div>

      {/* Right Image Area attached to imageRef for animation */}
      <div className="hero-image" ref={imageRef}>
        <img src={hospitalImg} alt="GS Healthcare Team" />
      </div>
      
    </section>
  );
};

export default Home;