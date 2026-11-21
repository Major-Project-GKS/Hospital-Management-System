// src/Pages/Doctor/DoctorDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EditProfileComp from '../../Components/EditProfileComp';
import './DoctorDashboard.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [doctorData, setDoctorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // --- Prescription States ---
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [isSubmittingPres, setIsSubmittingPres] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState({
    weight: '',
    bp: '',
    lab_tests: '',
    diagnosis: '',
    medicines: [{ name: '', dosage: '', duration: '' }],
    advice: ''
  });

  const navigate = useNavigate();
  const contentRef = useRef(null);
  const modalRef = useRef(null);
  const UPLOADS_URL = `${API_BASE_URL}/uploads/`;

  // 1. Fetch Real Data from Backend
  useEffect(() => {
    const fetchDocData = async () => {
      try {
        const docId = localStorage.getItem('userId');
        if (!docId) {
          navigate('/');
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/api/doctor/dashboard/${docId}`);
        setDoctorData(res.data.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Fetch Error', err);
        localStorage.clear();
        navigate('/');
      }
    };
    fetchDocData();
  }, [navigate]);

  // Animate tab transitions
  useEffect(() => {
    if (!isLoading && contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [activeTab, isLoading]);

  // GSAP for Modal
  useEffect(() => {
    if (showPrescriptionModal && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.92, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: 'back.out(1.5)' }
      );
    }
  }, [showPrescriptionModal]);

  // 2. Handle Real-Time Status Changes (Waiting, Hold, Completed, Absent)
  const handleStatusChange = async (apptId, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/api/appointment/status/${apptId}`, {
        status: newStatus
      });

      setDoctorData((prev) => ({
        ...prev,
        queue: prev.queue.map((appt) =>
          appt.appointment_id === apptId ? { ...appt, status: newStatus } : appt
        )
      }));

      if (newStatus === 'Hold') {
        toast.info('Patient placed On Hold');
      } else if (newStatus === 'Waiting') {
        toast.success('Patient resumed to Waiting queue');
      } else {
        toast.success(`Patient marked as ${newStatus}`);
      }
    } catch (err) {
      toast.error('Failed to update status on server');
    }
  };

  // Medicine List Helpers
  const handleMedicineChange = (index, field, value) => {
    const updatedMeds = [...prescriptionData.medicines];
    updatedMeds[index][field] = value;
    setPrescriptionData({ ...prescriptionData, medicines: updatedMeds });
  };

  const addMedicineRow = () => {
    setPrescriptionData({
      ...prescriptionData,
      medicines: [...prescriptionData.medicines, { name: '', dosage: '', duration: '' }]
    });
  };

  const removeMedicineRow = (index) => {
    if (prescriptionData.medicines.length === 1) return;
    const updatedMeds = prescriptionData.medicines.filter((_, i) => i !== index);
    setPrescriptionData({ ...prescriptionData, medicines: updatedMeds });
  };

  const closePrescriptionModal = () => {
    setShowPrescriptionModal(false);
    setPrescriptionData({
      weight: '',
      bp: '',
      lab_tests: '',
      diagnosis: '',
      medicines: [{ name: '', dosage: '', duration: '' }],
      advice: ''
    });
  };

  // 3. Submit Digital Prescription
  const submitPrescription = async (e) => {
    e.preventDefault();
    setIsSubmittingPres(true);
    try {
      const payload = {
        appointment_id: selectedAppt.appointment_id,
        patient_id: selectedAppt.patient_id,
        doctor_id: doctorData.profile.doctor_id,
        doctor_name: doctorData.profile.name,
        ...prescriptionData
      };

      await axios.post(`${API_BASE_URL}/api/prescription/add`, payload);
      await handleStatusChange(selectedAppt.appointment_id, 'Completed');

      closePrescriptionModal();
      toast.success('Digital Prescription Sent Successfully!');
    } catch (err) {
      toast.error('Failed to save prescription');
    } finally {
      setIsSubmittingPres(false);
    }
  };

  if (isLoading) {
    return (
      <div className="doc-loading-screen">
        <div className="doc-spinner"></div>
        <p>Connecting to Doctor Clinical Portal...</p>
      </div>
    );
  }

  const waitingCount = doctorData.queue.filter((q) => q.status === 'Waiting').length;
  const holdCount = doctorData.queue.filter((q) => q.status === 'Hold').length;
  const completedCount = doctorData.queue.filter((q) => q.status === 'Completed').length;
  const absentCount = doctorData.queue.filter((q) => q.status === 'Absent').length;

  const filteredQueue = doctorData.queue.filter((p) => {
    const matchesSearch =
      p.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.appointment_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="doctor-dashboard">
      {/* --- SIDEBAR --- */}
      <aside className="dashboard-sidebar">
        <div className="doc-profile">
          <div className="avatar-ring">
            {doctorData.profile.photo ? (
              <img
                src={`${UPLOADS_URL}${doctorData.profile.photo}`}
                alt="Doctor"
                className="sidebar-profile-photo"
              />
            ) : (
              <span className="avatar-emoji">👨‍⚕️</span>
            )}
            <span className="online-indicator" title="Active Duty"></span>
          </div>
          <div className="doc-profile-meta">
            <h3>Dr. {doctorData.profile.name}</h3>
            <span className="dept-pill">{doctorData.profile.department}</span>
            <p className="doc-id-tag">ID: {doctorData.profile.doctor_id}</p>
          </div>
        </div>

        <ul className="sidebar-menu">
          <li
            className={activeTab === 'Dashboard' ? 'active' : ''}
            onClick={() => {
              setActiveTab('Dashboard');
              setIsEditing(false);
            }}
          >
            <span className="menu-icon">📊</span> Dashboard
          </li>
          <li
            className={activeTab === 'Queue' ? 'active' : ''}
            onClick={() => {
              setActiveTab('Queue');
              setIsEditing(false);
            }}
          >
            <span className="menu-icon">🩺</span> Patient Queue
            {waitingCount > 0 && <span className="menu-badge">{waitingCount}</span>}
          </li>
          <li
            className={activeTab === 'Profile' ? 'active' : ''}
            onClick={() => {
              setActiveTab('Profile');
              setIsEditing(false);
            }}
          >
            <span className="menu-icon">👤</span> My Profile
          </li>
          <li
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
          >
            <span className="menu-icon">🚪</span> Logout
          </li>
        </ul>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="dashboard-content" ref={contentRef}>
        {/* 1. DASHBOARD OVERVIEW TAB */}
        {activeTab === 'Dashboard' && (
          <div className="doctor-overview-section">
            <div className="welcome-hero-banner">
              <div className="welcome-text">
                <span className="portal-badge">CLINICAL WORKSPACE</span>
                <h2>Welcome back, Dr. {doctorData.profile.name.split(' ')[0]}! 👋</h2>
                <p>
                  Department of <strong>{doctorData.profile.department}</strong> • All clinical nodes operational.
                </p>
              </div>
              <button className="btn-hero-action" onClick={() => setActiveTab('Queue')}>
                Open Live Queue &rarr;
              </button>
            </div>

            <div className="doctor-stats-grid">
              <div
                className="doc-stat-card amber-glow clickable-tab-card"
                onClick={() => {
                  setStatusFilter('Waiting');
                  setActiveTab('Queue');
                }}
              >
                <div className="card-icon-wrapper amber-bg">⏳</div>
                <div className="card-metric-info">
                  <h3>{waitingCount}</h3>
                  <p>Patients Waiting</p>
                </div>
              </div>

              <div
                className="doc-stat-card violet-glow clickable-tab-card"
                onClick={() => {
                  setStatusFilter('Hold');
                  setActiveTab('Queue');
                }}
              >
                <div className="card-icon-wrapper violet-bg">⏸️</div>
                <div className="card-metric-info">
                  <h3>{holdCount}</h3>
                  <p>Patients On Hold</p>
                </div>
              </div>

              <div
                className="doc-stat-card emerald-glow clickable-tab-card"
                onClick={() => {
                  setStatusFilter('Completed');
                  setActiveTab('Queue');
                }}
              >
                <div className="card-icon-wrapper emerald-bg">✅</div>
                <div className="card-metric-info">
                  <h3>{completedCount}</h3>
                  <p>Completed Checkups</p>
                </div>
              </div>

              <div
                className="doc-stat-card sapphire-glow clickable-tab-card"
                onClick={() => {
                  setStatusFilter('All');
                  setActiveTab('Queue');
                }}
              >
                <div className="card-icon-wrapper sapphire-bg">📅</div>
                <div className="card-metric-info">
                  <h3>{doctorData.queue.length}</h3>
                  <p>Total Allocations</p>
                </div>
              </div>
            </div>

            <div className="queue-summary-preview-card">
              <div className="preview-card-header">
                <h3>Shift Activity & Load Summary</h3>
                <button className="btn-view-all" onClick={() => setActiveTab('Queue')}>
                  Manage Queue &rarr;
                </button>
              </div>
              <div className="preview-metrics-strip">
                <div className="metric-pill-item">
                  <span className="metric-sub-label">Active Department</span>
                  <strong>{doctorData.profile.department}</strong>
                </div>
                <div className="metric-pill-item">
                  <span className="metric-sub-label">On Hold / Absent</span>
                  <strong>{holdCount} Hold • {absentCount} Absent</strong>
                </div>
                <div className="metric-pill-item">
                  <span className="metric-sub-label">Current Queue Load</span>
                  <strong className={waitingCount > 3 ? 'load-high' : 'load-stable'}>
                    {waitingCount > 3 ? '🔴 High Load' : '🟢 Optimal Load'}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. PATIENT QUEUE TAB */}
        {activeTab === 'Queue' && (
          <div className="queue-section">
            <div className="section-header">
              <div>
                <h2>Patient Appointment Queue</h2>
                <p className="section-subtitle">Manage consultations, hold unavailable patients, and issue prescriptions</p>
              </div>

              <div className="queue-controls">
                <div className="filter-pills">
                  {[
                    { label: 'All', value: 'All' },
                    { label: 'Waiting', value: 'Waiting' },
                    { label: `On Hold (${holdCount})`, value: 'Hold' },
                    { label: 'Completed', value: 'Completed' },
                    { label: 'Absent', value: 'Absent' }
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      className={`filter-pill ${statusFilter === tab.value ? 'active' : ''}`}
                      onClick={() => setStatusFilter(tab.value)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="🔍 Search Patient or Appt ID..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="table-container">
              <table className="queue-table">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Appt ID</th>
                    <th>Patient Name</th>
                    <th>Date & Slot</th>
                    <th>Status</th>
                    <th>Clinical Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredQueue.length > 0 ? (
                    filteredQueue.map((p, index) => (
                      <tr
                        key={p.appointment_id}
                        className={p.status === 'Hold' ? 'row-on-hold' : ''}
                      >
                        <td data-label="Token">
                          <span className="serial-chip">#{index + 1}</span>
                        </td>
                        <td data-label="Appt ID" className="mono-id">{p.appointment_id}</td>
                        <td data-label="Patient" className="patient-name-cell">{p.patient_name}</td>
                        <td data-label="Date & Slot">
                          <div className="schedule-cell">
                            <span className="date-text">{p.date}</span>
                            <span className="time-text">{p.time_slot}</span>
                          </div>
                        </td>
                        <td data-label="Status">
                          <span className={`status-badge ${p.status.toLowerCase()}`}>
                            <span className="status-dot"></span>
                            {p.status === 'Hold' ? 'On Hold' : p.status}
                          </span>
                        </td>
                        <td data-label="Actions" className="actions-td">
                          {p.status === 'Waiting' && (
                            <div className="action-btns">
                              <button
                                className="btn-prescribe"
                                onClick={() => {
                                  setSelectedAppt(p);
                                  setShowPrescriptionModal(true);
                                }}
                              >
                                💊 Prescribe
                              </button>
                              <button
                                className="btn-hold"
                                onClick={() => handleStatusChange(p.appointment_id, 'Hold')}
                                title="Patient not available right now"
                              >
                                ⏸ Hold
                              </button>
                              <button
                                className="btn-absent"
                                onClick={() => handleStatusChange(p.appointment_id, 'Absent')}
                              >
                                ✕ Absent
                              </button>
                            </div>
                          )}

                          {p.status === 'Hold' && (
                            <div className="action-btns">
                              <button
                                className="btn-prescribe"
                                onClick={() => {
                                  setSelectedAppt(p);
                                  setShowPrescriptionModal(true);
                                }}
                              >
                                💊 Prescribe
                              </button>
                              <button
                                className="btn-resume"
                                onClick={() => handleStatusChange(p.appointment_id, 'Waiting')}
                                title="Move back to Waiting queue"
                              >
                                ▶ Resume
                              </button>
                              <button
                                className="btn-absent"
                                onClick={() => handleStatusChange(p.appointment_id, 'Absent')}
                              >
                                ✕ Absent
                              </button>
                            </div>
                          )}

                          {(p.status === 'Completed' || p.status === 'Absent') && (
                            <span className={`static-status-text ${p.status.toLowerCase()}`}>
                              {p.status === 'Completed' ? '✔ Prescription Issued' : '✕ Marked Absent'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="empty-table-text">
                        No matching patient appointments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. PROFILE MANAGEMENT TAB */}
        {activeTab === 'Profile' && (
          <div className="doctor-profile-tab-section">
            <div className="profile-section-header">
              <div>
                <h2>My Profile Management</h2>
                <p className="section-subtitle">View and update your clinical credentials</p>
              </div>
              {!isEditing && (
                <button className="btn-corner-edit" onClick={() => setIsEditing(true)}>
                  ✏️ Edit Profile
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="dash-card profile-details-card">
                <div className="profile-details-grid">
                  <div className="detail-item">
                    <h4 className="detail-label">Full Name</h4>
                    <p className="detail-value">Dr. {doctorData.profile.name}</p>
                  </div>
                  <div className="detail-item">
                    <h4 className="detail-label">Specialization Department</h4>
                    <p className="detail-value">{doctorData.profile.department}</p>
                  </div>
                  <div className="detail-item">
                    <h4 className="detail-label">Institutional Contact Email</h4>
                    <p className="detail-value">{doctorData.profile.email}</p>
                  </div>
                  <div className="detail-item">
                    <h4 className="detail-label">Phone Reference</h4>
                    <p className="detail-value">+91 {doctorData.profile.phone}</p>
                  </div>
                  <div className="detail-item">
                    <h4 className="detail-label">Clinical Experience</h4>
                    <p className="detail-value">{doctorData.profile.experience} Years</p>
                  </div>
                  <div className="detail-item">
                    <h4 className="detail-label">Operational Region / City</h4>
                    <p className="detail-value">{doctorData.profile.region_city || 'Odisha'}</p>
                  </div>
                  <div className="detail-item">
                    <h4 className="detail-label">Comfortable Languages</h4>
                    <p className="detail-value">
                      {doctorData.profile.comfortable_language || 'English, Hindi, Odia'}
                    </p>
                  </div>
                  <div className="detail-item">
                    <h4 className="detail-label">Assigned Medical State</h4>
                    <p className="detail-value">{doctorData.profile.state || 'Odisha'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <EditProfileComp
                initialData={doctorData.profile}
                role="Doctor"
                onCancel={() => setIsEditing(false)}
                onUpdateSuccess={(updatedFields) => {
                  setDoctorData({
                    ...doctorData,
                    profile: { ...doctorData.profile, ...updatedFields }
                  });
                  setIsEditing(false);
                }}
              />
            )}
          </div>
        )}

        {/* 4. DIGITAL PRESCRIPTION MODAL */}
        {showPrescriptionModal && selectedAppt && (
          <div className="modal-overlay" onClick={closePrescriptionModal}>
            <div
              className="prescription-modal"
              ref={modalRef}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header-bar">
                <div>
                  <span className="rx-badge">Rx • DIGITAL PRESCRIPTION</span>
                  <h2>Issue Clinical Prescription</h2>
                </div>
                <button
                  type="button"
                  className="close-modal"
                  onClick={closePrescriptionModal}
                  aria-label="Close modal"
                >
                  &times;
                </button>
              </div>

              <div className="patient-banner-strip">
                <div className="patient-banner-item">
                  <span className="banner-label">PATIENT NAME</span>
                  <strong>{selectedAppt.patient_name}</strong>
                </div>
                <div className="patient-banner-item">
                  <span className="banner-label">PATIENT ID</span>
                  <strong>{selectedAppt.patient_id}</strong>
                </div>
                <div className="patient-banner-item">
                  <span className="banner-label">APPOINTMENT</span>
                  <strong>{selectedAppt.appointment_id}</strong>
                </div>
              </div>

              <form onSubmit={submitPrescription} className="prescription-form">
                <div className="vitals-row-grid">
                  <div className="pres-form-group">
                    <label htmlFor="weight">
                      Patient Weight <span className="optional-tag">(Optional)</span>
                    </label>
                    <input
                      id="weight"
                      type="text"
                      value={prescriptionData.weight}
                      placeholder="e.g., 68 kg"
                      onChange={(e) =>
                        setPrescriptionData({ ...prescriptionData, weight: e.target.value })
                      }
                    />
                  </div>

                  <div className="pres-form-group">
                    <label htmlFor="bp">
                      Blood Pressure (BP) <span className="optional-tag">(Optional)</span>
                    </label>
                    <input
                      id="bp"
                      type="text"
                      value={prescriptionData.bp}
                      placeholder="e.g., 120/80 mmHg"
                      onChange={(e) =>
                        setPrescriptionData({ ...prescriptionData, bp: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="pres-form-group">
                  <label htmlFor="diagnosis">Diagnosis / Clinical Findings *</label>
                  <textarea
                    id="diagnosis"
                    rows="2"
                    required
                    value={prescriptionData.diagnosis}
                    placeholder="E.g., Acute viral upper respiratory infection, mild fever..."
                    onChange={(e) =>
                      setPrescriptionData({ ...prescriptionData, diagnosis: e.target.value })
                    }
                  />
                </div>

                <div className="pres-form-group">
                  <div className="med-section-header">
                    <label>Prescribed Medicines *</label>
                    <span className="med-hint">Specify dosage schedule & duration</span>
                  </div>

                  <div className="medicine-list-container">
                    {prescriptionData.medicines.map((med, index) => (
                      <div key={index} className="med-row-grid">
                        <input
                          type="text"
                          placeholder="Medicine Name (e.g. Paracetamol 650mg)"
                          required
                          value={med.name}
                          onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Dosage (e.g. 1-0-1)"
                          required
                          value={med.dosage}
                          onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Duration (e.g. 5 Days)"
                          required
                          value={med.duration}
                          onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                        />
                        {prescriptionData.medicines.length > 1 && (
                          <button
                            type="button"
                            className="btn-remove-med"
                            onClick={() => removeMedicineRow(index)}
                            title="Remove medicine"
                          >
                            🗑️ Remove
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button type="button" className="btn-add-med" onClick={addMedicineRow}>
                    + Add Another Medicine
                  </button>
                </div>

                <div className="pres-form-group">
                  <label htmlFor="lab_tests">
                    Recommended Lab Tests <span className="optional-tag">(Optional)</span>
                  </label>
                  <input
                    id="lab_tests"
                    type="text"
                    value={prescriptionData.lab_tests}
                    placeholder="e.g., CBC, Blood Sugar Fasting, Lipid Profile, X-Ray..."
                    onChange={(e) =>
                      setPrescriptionData({ ...prescriptionData, lab_tests: e.target.value })
                    }
                  />
                </div>

                <div className="pres-form-group">
                  <label htmlFor="advice">
                    Additional Clinical Advice <span className="optional-tag">(Optional)</span>
                  </label>
                  <input
                    id="advice"
                    type="text"
                    value={prescriptionData.advice}
                    placeholder="E.g., Drink plenty of warm fluids, rest for 3 days, follow up if fever persists..."
                    onChange={(e) =>
                      setPrescriptionData({ ...prescriptionData, advice: e.target.value })
                    }
                  />
                </div>

                <div className="modal-footer-actions">
                  <button
                    type="button"
                    className="btn-cancel-modal"
                    onClick={closePrescriptionModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-submit-pres"
                    disabled={isSubmittingPres}
                  >
                    {isSubmittingPres ? 'Sending Prescription...' : '✔ Send Digital Prescription'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DoctorDashboard;