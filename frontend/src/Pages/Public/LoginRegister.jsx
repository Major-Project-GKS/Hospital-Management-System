import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './LoginRegister.css';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true); // true = Login, false = Register
  const [role, setRole] = useState('Patient'); // 'Patient', 'Doctor', 'Manager'
  
  const formContainerRef = useRef(null);

  // Animate the form container when switching between Login/Register
  useEffect(() => {
    gsap.fromTo(formContainerRef.current, 
      { 
        y: 30, 
        opacity: 0 
      },
      { 
        y: 0, 
        opacity: 1, // Forces 100% visibility
        duration: 0.8, 
        ease: "power3.out" 
      }
    );
  }, [isLogin]); 

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Submitting ${isLogin ? 'Login' : 'Registration'} for ${role}`);
  };

  return (
    <div className="auth-page">
      <div className="auth-card" ref={formContainerRef}>
        
        {/* Top Toggle: Login vs Register */}
        <div className="auth-toggle">
          <button 
            className={isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(true)}
            type="button"
          >
            Login
          </button>
          <button 
            className={!isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(false)}
            type="button"
          >
            New Registration
          </button>
        </div>

        {/* Role Tabs */}
        <div className="role-tabs">
          {['Patient', 'Doctor', 'Manager'].map((r) => (
            <button
              key={r}
              type="button"
              className={`tab-btn ${role === r ? 'active-tab' : ''}`}
              onClick={() => setRole(r)}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="auth-header">
          <h2>{role} {isLogin ? 'Login' : 'Registration'}</h2>
          <p>{isLogin ? 'Welcome back! Please enter your details.' : 'Create an account to get started.'}</p>
        </div>

        {/* The Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          
          {/* LOGIN FIELDS */}
          {isLogin && (
            <>
              <div className="form-group">
                <label>{role === 'Patient' ? 'Application ID (PTXXXX)' : role === 'Doctor' ? 'Doctor ID (DRXXXX)' : 'Manager ID (HMXXXX)'}</label>
                <input type="text" placeholder={`Enter ${role} ID`} required />
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="Enter password" required />
              </div>
              
              {/* FORGOT PASSWORD LINK */}
              <div className="forgot-password">
                <a href="#!">Forgot Password?</a>
              </div>
            </>
          )}

          {/* REGISTRATION FIELDS */}
          {!isLogin && (
            <div className="register-grid">
              {/* Common Fields */}
              <div className="form-group"><label>Full Name</label><input type="text" required /></div>
              <div className="form-group"><label>Phone Number</label><input type="tel" required /></div>
              <div className="form-group"><label>Email ID</label><input type="email" required /></div>
              <div className="form-group"><label>Aadhar Number</label><input type="text" required /></div>
              <div className="form-group"><label>Password</label><input type="password" required /></div>
              <div className="form-group"><label>Upload Photo</label><input type="file" accept="image/*" required /></div>
              
              {/* Role-Specific Fields */}
              {role === 'Patient' && (
                <div className="form-group"><label>Upload Aadhar Card</label><input type="file" accept="image/*,.pdf" required /></div>
              )}

              {role === 'Manager' && (
                <div className="form-group"><label>Upload Aadhar Card</label><input type="file" accept="image/*,.pdf" required /></div>
              )}

              {role === 'Doctor' && (
                <>
                  <div className="form-group"><label>Department</label>
                    <select required>
                      <option value="">Select Department</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="General">General Medicine</option>
                    </select>
                  </div>
                  <div className="form-group"><label>Experience (Years)</label><input type="number" required /></div>
                  <div className="form-group"><label>State</label><input type="text" required /></div>
                  <div className="form-group"><label>Region/City</label><input type="text" required /></div>
                  <div className="form-group"><label>Comfortable Language</label><input type="text" placeholder="e.g. English, Hindi" required /></div>
                  <div className="form-group"><label>Upload Certified Proof</label><input type="file" accept="image/*,.pdf" required /></div>
                </>
              )}
            </div>
          )}

          <button type="submit" className="btn-submit">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default LoginRegister;