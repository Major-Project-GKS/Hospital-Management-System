import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import './Home.css';

const Home = () => {
  const cardsRef = useRef([]);

  // Helper to push card refs to the array
  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useEffect(() => {
    // GSAP Animation: Slide up and fade in cards
    gsap.from(cardsRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.2,
      ease: "power2.out",
      delay: 0.3 // Starts slightly after navbar animation
    });
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1>Smart Hospital Management System</h1>
        <p>Advanced healthcare scheduling, patient management, and digital reports—all in one secure platform.</p>
        <div className="hero-buttons">
          <Link to="/appointment" className="btn-primary">Book Appointment</Link>
          <Link to="/schedule" className="btn-secondary">View Doctors</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-card" ref={addToRefs}>
          <div className="icon">📅</div>
          <h3>Easy Booking</h3>
          <p>Book appointments dynamically based on real-time doctor availability and department.</p>
        </div>
        
        <div className="feature-card" ref={addToRefs}>
          <div className="icon">📄</div>
          <h3>Digital Reports</h3>
          <p>Securely access your checkups, statuses, and uploaded prescriptions from anywhere.</p>
        </div>
        
        <div className="feature-card" ref={addToRefs}>
          <div className="icon">👨‍⚕️</div>
          <h3>Doctor Scheduling</h3>
          <p>Hospital managers can easily set and update day-wise schedules for all medical staff.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;