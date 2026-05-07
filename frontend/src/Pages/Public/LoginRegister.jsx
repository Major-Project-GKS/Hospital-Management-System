import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import axios from 'axios';
import { toast } from 'react-toastify';
import './LoginRegister.css';

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('Patient');
  const formContainerRef = useRef(null);

  // Login States
  const [loginData, setLoginData] = useState({ login_id: '', password: '' });

  // Registration States
  const [regData, setRegData] = useState({
    name: '', phone: '', email: '', aadhar: '', password: '',
    experience: '', state: '', city: '', language: '', department: ''
  });
  const [files, setFiles] = useState({ photo: null, aadharCard: null, proof: null });

  useEffect(() => {
    gsap.fromTo(formContainerRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" });
  }, [isLogin]);

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const API_BASE_URL = 'http://localhost:5000/api';

    try {
      if (isLogin) {
        // ==========================================
        // 1. FIXED LOGIN LOGIC & REDIRECTION
        // ==========================================
        const res = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
        
        // Grab data from backend response
        const backendData = res.data.data;
        const loggedInId = backendData.login_id || backendData.application_id || backendData.doctor_id || backendData.manager_id || loginData.login_id;
        let loggedInRole = backendData.role;

        // FAIL-SAFE: If backend doesn't send the role, check the ID prefix!
        if (!loggedInRole) {
          if (loggedInId.startsWith('PT')) loggedInRole = 'Patient';
          else if (loggedInId.startsWith('DR')) loggedInRole = 'Doctor';
          else if (loggedInId.startsWith('HM')) loggedInRole = 'Manager';
          else loggedInRole = role; // Fallback to current tab
        }

        // SAVE ALL DATA SO DASHBOARDS WORK
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userRole', loggedInRole);
        localStorage.setItem('userName', backendData.name);
        localStorage.setItem('userId', loggedInId);

        toast.success(`Welcome ${backendData.name}!`);
        
        // REDIRECT SECURELY
        const dashboardPaths = { 
          Patient: '/patient/dashboard', 
          Doctor: '/doctor/dashboard', 
          Manager: '/manager/dashboard' 
        };
        
        window.location.href = dashboardPaths[loggedInRole] || '/';

      } else {
        // ==========================================
        // REGISTRATION LOGIC
        // ==========================================
        const formData = new FormData();
        formData.append('name', regData.name);
        formData.append('phone', regData.phone);
        formData.append('email', regData.email);
        formData.append('aadhar_number', regData.aadhar);
        formData.append('password', regData.password);
        if (files.photo) formData.append('photo', files.photo);

        let endpoint = '';
        if (role === 'Patient') {
          endpoint = '/patient/register';
          if (files.aadharCard) formData.append('aadhar_card', files.aadharCard);
        } else if (role === 'Manager') {
          endpoint = '/manager/register';
        } else if (role === 'Doctor') {
          endpoint = '/doctor/register';
          formData.append('department', regData.department);
          formData.append('experience', regData.experience);
          formData.append('state', regData.state);
          formData.append('region_city', regData.city);
          formData.append('comfortable_language', regData.language);
          if (files.proof) formData.append('certified_proof', files.proof);
        }

        const res = await axios.post(`${API_BASE_URL}${endpoint}`, formData);
        const generatedId = res.data.data.application_id || res.data.data.doctor_id || res.data.data.manager_id;
        
        toast.success(`Registration Successful! Your ID: ${generatedId}`);
        setIsLogin(true); // Switch to login view
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || "Action Failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" ref={formContainerRef}>
        <div className="auth-toggle">
          <button type="button" className={isLogin ? 'active' : ''} onClick={() => setIsLogin(true)}>Login</button>
          <button type="button" className={!isLogin ? 'active' : ''} onClick={() => setIsLogin(false)}>New Registration</button>
        </div>

        <div className="role-tabs">
          {['Patient', 'Doctor', 'Manager'].map((r) => (
            <button type="button" key={r} className={`tab-btn ${role === r ? 'active-tab' : ''}`} onClick={() => setRole(r)}>{r}</button>
          ))}
        </div>

        <div className="auth-header">
          <h2>{role} {isLogin ? 'Login' : 'Registration'}</h2>
          <p>{isLogin ? 'Welcome back! Please enter your details.' : 'Create an account to get started.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {isLogin ? (
            <>
              <div className="form-group">
                <label>Login ID ({role === 'Patient' ? 'PTXXXX' : role === 'Doctor' ? 'DRXXXX' : 'HMXXXX'})</label>
                <input type="text" placeholder="Enter ID" required onChange={(e) => setLoginData({...loginData, login_id: e.target.value.toUpperCase()})} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="Enter password" required onChange={(e) => setLoginData({...loginData, password: e.target.value})} />
              </div>
              <div className="forgot-password"><a href="#!">Forgot Password?</a></div>
            </>
          ) : (
            <div className="register-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={regData.name} onChange={(e) => /^[a-zA-Z\s]*$/.test(e.target.value) && setRegData({...regData, name: e.target.value})} required />
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <div className="phone-input-wrapper">
                  <span className="country-code">+91</span>
                  {/* Added value binding so letters are physically prevented from showing */}
                  <input type="tel" value={regData.phone} maxLength="10" onChange={(e) => setRegData({...regData, phone: e.target.value.replace(/\D/g, '')})} required />
                </div>
              </div>
              
              <div className="form-group"><label>Email ID</label><input type="email" onChange={(e) => setRegData({...regData, email: e.target.value})} required /></div>
              
              <div className="form-group">
                <label>Aadhar Number</label>
                {/* 2. FIXED AADHAR NUMBER VALIDATION (Added value={regData.aadhar}) */}
                <input type="text" value={regData.aadhar} maxLength="12" placeholder="12-digit number" onChange={(e) => setRegData({...regData, aadhar: e.target.value.replace(/\D/g, '')})} required />
              </div>
              
              <div className="form-group"><label>Password</label><input type="password" onChange={(e) => setRegData({...regData, password: e.target.value})} required /></div>
              <div className="form-group"><label>Upload Photo</label><input type="file" name="photo" accept="image/*" onChange={handleFileChange} required /></div>

              {role === 'Doctor' && (
                <>
                  <div className="form-group">
                    <label>Department</label>
                    <select required onChange={(e) => setRegData({...regData, department: e.target.value})}>
                      <option value="">Select</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="General">General Medicine</option>
                    </select>
                  </div>
                  <div className="form-group"><label>Experience in years</label><input type="number" onChange={(e) => setRegData({...regData, experience: e.target.value})} required /></div>
                  <div className="form-group"><label>State</label><input type="text" onChange={(e) => setRegData({...regData, state: e.target.value})} required /></div>
                  <div className="form-group"><label>City</label><input type="text" onChange={(e) => setRegData({...regData, city: e.target.value})} required /></div>
                  <div className="form-group"><label>Language</label><input type="text" onChange={(e) => setRegData({...regData, language: e.target.value})} required /></div>
                  <div className="form-group"><label>Certified Proof</label><input type="file" name="proof" accept="image/*,.pdf" onChange={handleFileChange} required /></div>
                </>
              )}
              
              {(role === 'Patient' || role === 'Manager') && (
                <div className="form-group"><label>Upload Aadhar Card</label><input type="file" name="aadharCard" accept="image/*,.pdf" onChange={handleFileChange} required /></div>
              )}
            </div>
          )}
          <button type="submit" className="btn-submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
      </div>
    </div>
  );
};

export default LoginRegister;