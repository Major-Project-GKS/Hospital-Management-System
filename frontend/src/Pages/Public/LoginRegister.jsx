// src/Pages/Public/LoginRegister.jsx
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import './LoginRegister.css';

const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

const LoginRegister = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.isRegister ? false : true);
  const [isForgot, setIsForgot] = useState(false);
  const [role, setRole] = useState('Patient');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cardRef = useRef(null);
  const formWorkspaceRef = useRef(null);
  const navigate = useNavigate();

  // Login States
  const [loginData, setLoginData] = useState({ login_id: '', password: '' });

  // Reset Password States
  const [resetData, setResetData] = useState({ email: '', aadhar: '', newPassword: '' });

  // Registration States
  const [regData, setRegData] = useState({
    name: '',
    phone: '',
    email: '',
    aadhar: '',
    password: '',
    experience: '',
    state: '',
    city: '',
    language: '',
    department: ''
  });
  const [files, setFiles] = useState({ photo: null, aadharCard: null, proof: null });

  useEffect(() => {
    if (location.state?.isRegister !== undefined) {
      setIsLogin(!location.state.isRegister);
      setIsForgot(false);
    }
  }, [location.state]);

  useEffect(() => {
    if (formWorkspaceRef.current) {
      gsap.fromTo(
        formWorkspaceRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [isLogin, isForgot, role]);

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      if (isLogin) {
        const res = await axios.post(`${API_BASE_URL}/auth/login`, {
          login_id: loginData.login_id.trim().toUpperCase(),
          password: loginData.password
        });

        if (res.data.success) {
          const { token, user } = res.data;
          localStorage.setItem('token', token);
          localStorage.setItem('userId', user.id);
          localStorage.setItem('userName', user.name);
          localStorage.setItem('userRole', user.role);
          localStorage.setItem('role', user.role);
          if (user.phone) localStorage.setItem('userPhone', user.phone);
          if (user.email) localStorage.setItem('userEmail', user.email);

          toast.success(`Welcome back, ${user.name}!`);

          if (user.role === 'Manager') navigate('/manager/dashboard');
          else if (user.role === 'Doctor') navigate('/doctor/dashboard');
          else navigate('/patient/dashboard');
        }
      } else {
        if (regData.phone.length !== 10) {
          toast.warning('Please enter a valid 10-digit phone number.');
          setIsSubmitting(false);
          return;
        }
        if (regData.aadhar.length !== 12) {
          toast.warning('Please enter a valid 12-digit identification number.');
          setIsSubmitting(false);
          return;
        }

        const formData = new FormData();
        formData.append('name', regData.name.trim());
        formData.append('phone', regData.phone.trim());
        formData.append('email', regData.email.trim());
        formData.append('aadhar_number', regData.aadhar.trim());
        formData.append('password', regData.password);

        if (files.photo) formData.append('photo', files.photo);

        let endpoint = '';
        if (role === 'Patient') {
          endpoint = '/patient/register';
          if (files.aadharCard) formData.append('aadhar_card', files.aadharCard);
        } else if (role === 'Manager') {
          endpoint = '/manager/register';
          if (files.aadharCard) formData.append('aadhar_card', files.aadharCard);
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
        const generatedId =
          res.data.data.application_id ||
          res.data.data.doctor_id ||
          res.data.data.manager_id;

        toast.success(`Registration Successful! Your Login ID: ${generatedId}`, {
          autoClose: 8000
        });
        setLoginData({ login_id: generatedId || '', password: '' });
        setIsLogin(true);
      }
    } catch (err) {
      console.error('Auth Error:', err.response?.data || err.message);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Network or server error. Please check your connection and try again.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        email: resetData.email.trim(),
        aadhar_number: resetData.aadhar.trim(),
        newPassword: resetData.newPassword
      });
      if (res.data.success) {
        toast.success('Password Updated Successfully!');
        setIsForgot(false);
        setIsLogin(true);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Verification criteria mismatch.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-single-frame-wrapper">
      <div className={`auth-split-layout-card ${!isLogin ? 'expand-width' : ''}`} ref={cardRef}>
        <div className="auth-form-workspace" ref={formWorkspaceRef}>
          {!isForgot && (
            <div className="compact-toggle-pill-bar">
              <button
                type="button"
                className={`toggle-pill ${isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(true)}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`toggle-pill ${!isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(false)}
              >
                New Registration
              </button>
            </div>
          )}

          {isForgot ? (
            <div className="auth-step-node-form">
              <div className="workspace-header-title">
                <h3>Reset Password</h3>
                <p>Verify data identity tokens to clear workspace restrictions.</p>
              </div>
              <form onSubmit={handleResetSubmit} className="workspace-compact-form">
                <div className="form-group-compact">
                  <label>Email Address</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    required
                    onChange={(e) => setResetData({ ...resetData, email: e.target.value })}
                  />
                </div>
                <div className="form-group-compact">
                  <label>Aadhar Number</label>
                  <input
                    type="text"
                    maxLength="12"
                    placeholder="12-digit structural code"
                    required
                    value={resetData.aadhar}
                    onChange={(e) =>
                      setResetData({ ...resetData, aadhar: e.target.value.replace(/\D/g, '') })
                    }
                  />
                </div>
                <div className="form-group-compact">
                  <label>New Passkey Phrase</label>
                  <input
                    type="password"
                    placeholder="Configure safe characters"
                    required
                    onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                  />
                </div>
                <div className="button-group-vertical-stack">
                  <button
                    type="submit"
                    className="btn-action-submit-node"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Updating...' : 'Update Credentials'}
                  </button>
                  <button
                    type="button"
                    className="btn-action-text-fallback"
                    onClick={() => setIsForgot(false)}
                  >
                    Return to Account Login
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="auth-step-node-form">
              <div className="role-pills-row">
                {['Patient', 'Doctor', 'Manager'].map((r) => (
                  <button
                    type="button"
                    key={r}
                    className={`role-pill-btn ${role === r ? 'selected' : ''}`}
                    onClick={() => setRole(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="workspace-header-title">
                <h3>
                  {role} {isLogin ? 'Login' : 'Registration'}
                </h3>
                <p>
                  {isLogin
                    ? 'Welcome back! Input your verification parameters.'
                    : 'Provide required registry settings to generate an institutional profile.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="workspace-compact-form">
                {isLogin ? (
                  <div className="login-vertical-input-stack">
                    <div className="form-group-compact">
                      <label>
                        Login ID ({role === 'Patient' ? 'PTXXXX' : role === 'Doctor' ? 'DRXXXX' : 'HMXXXX'})
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. PT0001"
                        required
                        value={loginData.login_id}
                        onChange={(e) =>
                          setLoginData({ ...loginData, login_id: e.target.value.toUpperCase() })
                        }
                      />
                    </div>
                    <div className="form-group-compact">
                      <label>Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        required
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({ ...loginData, password: e.target.value })
                        }
                      />
                    </div>
                    <div className="forgot-password-link-alignment">
                      <a
                        href="#!"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsForgot(true);
                        }}
                      >
                        Forgot Password?
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className={`registration-matrix-scroller ${role === 'Doctor' ? 'tall-scroller' : ''}`}>
                    <div className="form-row-grid">
                      <div className="form-group-compact">
                        <label>Full Name</label>
                        <input
                          type="text"
                          placeholder="Enter full name"
                          value={regData.name}
                          onChange={(e) =>
                            /^[a-zA-Z\s]*$/.test(e.target.value) &&
                            setRegData({ ...regData, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="form-group-compact">
                        <label>Phone Contact</label>
                        <div className="phone-wrapper-compact-node">
                          <span className="prefix-tag">+91</span>
                          <input
                            type="tel"
                            placeholder="10-digit number"
                            value={regData.phone}
                            maxLength="10"
                            onChange={(e) =>
                              setRegData({
                                ...regData,
                                phone: e.target.value.replace(/\D/g, '')
                              })
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-row-grid">
                      <div className="form-group-compact">
                        <label>Email Address</label>
                        <input
                          type="email"
                          placeholder="name@domain.com"
                          required
                          value={regData.email}
                          onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                        />
                      </div>
                      <div className="form-group-compact">
                        <label>Aadhar Number</label>
                        <input
                          type="text"
                          value={regData.aadhar}
                          maxLength="12"
                          placeholder="12-digit registry code"
                          onChange={(e) =>
                            setRegData({
                              ...regData,
                              aadhar: e.target.value.replace(/\D/g, '')
                            })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row-grid">
                      <div className="form-group-compact">
                        <label>Create Password</label>
                        <input
                          type="password"
                          placeholder="Minimum 6 characters"
                          required
                          value={regData.password}
                          onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                        />
                      </div>
                      <div className="form-group-compact">
                        <label>Profile Photo</label>
                        <input
                          type="file"
                          name="photo"
                          accept="image/*"
                          onChange={handleFileChange}
                          required
                        />
                      </div>
                    </div>

                    {role === 'Doctor' && (
                      <>
                        <div className="form-row-grid">
                          <div className="form-group-compact">
                            <label>Care Track Line</label>
                            <select
                              required
                              value={regData.department}
                              onChange={(e) =>
                                setRegData({ ...regData, department: e.target.value })
                              }
                            >
                              <option value="">Select Specialization...</option>
                              <option value="Cardiology">Cardiology</option>
                              <option value="Neurology">Neurology</option>
                              <option value="Orthopedics">Orthopedics</option>
                              <option value="General Medicine">General Medicine</option>
                              <option value="Pediatrics">Pediatrics</option>
                            </select>
                          </div>
                          <div className="form-group-compact">
                            <label>Experience Duration</label>
                            <input
                              type="number"
                              min="0"
                              placeholder="Years count"
                              required
                              value={regData.experience}
                              onChange={(e) =>
                                setRegData({ ...regData, experience: e.target.value })
                              }
                            />
                          </div>
                        </div>

                        <div className="form-row-grid">
                          <div className="form-group-compact">
                            <label>State Domain</label>
                            <input
                              type="text"
                              placeholder="e.g. Odisha"
                              required
                              value={regData.state}
                              onChange={(e) => setRegData({ ...regData, state: e.target.value })}
                            />
                          </div>
                          <div className="form-group-compact">
                            <label>City Hub</label>
                            <input
                              type="text"
                              placeholder="e.g. Bhubaneswar"
                              required
                              value={regData.city}
                              onChange={(e) => setRegData({ ...regData, city: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="form-row-grid">
                          <div className="form-group-compact">
                            <label>Communication Dialect</label>
                            <input
                              type="text"
                              placeholder="e.g. Odia, English"
                              required
                              value={regData.language}
                              onChange={(e) =>
                                setRegData({ ...regData, language: e.target.value })
                              }
                            />
                          </div>
                          <div className="form-group-compact">
                            <label>Certified Proof Log</label>
                            <input
                              type="file"
                              name="proof"
                              accept="image/*,.pdf"
                              onChange={handleFileChange}
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {(role === 'Patient' || role === 'Manager') && (
                      <div className="form-group-compact">
                        <label>Aadhar Document Scan</label>
                        <input
                          type="file"
                          name="aadharCard"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          required
                        />
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-action-submit-node"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? isLogin
                      ? 'Signing In...'
                      : 'Registering...'
                    : isLogin
                    ? 'Login 🔑'
                    : 'Register ⚡'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;