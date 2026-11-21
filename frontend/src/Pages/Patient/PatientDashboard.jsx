// src/Pages/Patient/PatientDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import axios from 'axios';
import EditProfileComp from '../../Components/EditProfileComp';
import hospitalLogo from '../../assets/logo.png';
import './PatientDashboard.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [patientData, setPatientData] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const contentRef = useRef(null);
  const navigate = useNavigate();
  const UPLOADS_URL = `${API_BASE_URL}/uploads/`;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const patientId = localStorage.getItem('userId');
        if (!patientId) {
          navigate('/');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/patient/dashboard/${patientId}`);
        setPatientData(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
        alert('Session expired. Please log in again.');
        localStorage.clear();
        navigate('/');
      }
    };
    fetchDashboardData();
  }, [navigate]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (activeTab === 'History') {
        try {
          const patientId = localStorage.getItem('userId');
          const res = await axios.get(`${API_BASE_URL}/api/prescription/patient/${patientId}`);
          setPrescriptions(res.data.data);
        } catch (error) {
          console.error('Error fetching prescriptions:', error);
        }
      }
    };
    fetchPrescriptions();
  }, [activeTab]);

  useEffect(() => {
    if (!isLoading && contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [activeTab, isLoading, isEditing]);

  // Generate & Download Formatted GS Health Care Prescription PDF
  const downloadPDF = (pres) => {
    const patientName = patientData?.profile?.name || localStorage.getItem('userName') || 'Patient';
    const patientId =
      patientData?.profile?.application_id ||
      patientData?.profile?.patient_id ||
      localStorage.getItem('userId') ||
      'N/A';
    const patientPhone = patientData?.profile?.phone || 'N/A';

    const visitDate =
      pres.date ||
      (pres.createdAt
        ? new Date(pres.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          })
        : new Date().toLocaleDateString('en-IN'));

    const logoAbsoluteUrl = new URL(hospitalLogo, window.location.origin).href;

    const medicinesRows = (pres.medicines || [])
      .map(
        (m, index) => `
          <tr>
            <td>${index + 1}</td>
            <td><strong>${m.name}</strong></td>
            <td>${m.dosage}</td>
            <td>${m.duration || 'As directed'}</td>
          </tr>
        `
      )
      .join('');

    const printWindow = window.open('', '_blank', 'width=850,height=920');
    if (!printWindow) {
      alert('Please allow pop-ups in your browser to download your prescription PDF.');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>GS_Health_Care_Prescription_${pres.appointment_id || patientId}</title>
        <style>
          * {
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #1e293b;
            margin: 0;
            padding: 30px;
            background: #ffffff;
          }
          .rx-container {
            max-width: 760px;
            margin: 0 auto;
            border: 2px solid #059669;
            border-radius: 14px;
            padding: 32px 36px;
            background: #ffffff;
          }
          .brand-header {
            text-align: center;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 18px;
            margin-bottom: 22px;
          }
          .gs-logo-img {
            width: 76px;
            height: 76px;
            object-fit: contain;
            margin: 0 auto 10px;
            display: block;
          }
          .brand-header h1 {
            margin: 0;
            font-size: 26px;
            font-weight: 800;
            letter-spacing: 0.8px;
            color: #0f172a;
            text-transform: uppercase;
          }
          .brand-header .tagline {
            margin: 4px 0 0;
            font-size: 12.5px;
            color: #059669;
            font-weight: 600;
            letter-spacing: 0.4px;
          }
          .doctor-visit-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 10px;
            padding: 14px 18px;
            margin-bottom: 18px;
          }
          .doc-info-block span,
          .visit-date-block span {
            display: block;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #64748b;
            font-weight: 700;
          }
          .doc-info-block strong {
            font-size: 16px;
            color: #065f46;
          }
          .visit-date-block {
            text-align: right;
          }
          .visit-date-block strong {
            font-size: 15px;
            color: #0f172a;
          }
          .patient-strip {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 12px 16px;
            margin-bottom: 16px;
            font-size: 13px;
          }
          .patient-strip span {
            display: block;
            font-size: 10.5px;
            color: #64748b;
            text-transform: uppercase;
            font-weight: 700;
          }
          .vitals-strip {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 10px;
            padding: 10px 16px;
            margin-bottom: 20px;
            font-size: 13px;
          }
          .vitals-strip span {
            display: block;
            font-size: 10.5px;
            color: #0369a1;
            text-transform: uppercase;
            font-weight: 700;
          }
          .section-label {
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            color: #0284c7;
            margin-bottom: 6px;
          }
          .diagnosis-box {
            background: #f0f9ff;
            border-left: 4px solid #0284c7;
            padding: 10px 14px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 22px;
          }
          .lab-box {
            background: #faf5ff;
            border-left: 4px solid #8b5cf6;
            padding: 10px 14px;
            border-radius: 6px;
            font-size: 13.5px;
            font-weight: 600;
            color: #4c1d95;
            margin-bottom: 22px;
          }
          .rx-symbol {
            font-size: 20px;
            font-weight: 800;
            color: #059669;
            margin-right: 6px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
            margin-bottom: 22px;
            font-size: 13.5px;
          }
          th, td {
            border: 1px solid #cbd5e1;
            padding: 10px 12px;
            text-align: left;
          }
          th {
            background: #f1f5f9;
            color: #334155;
            font-weight: 700;
          }
          .advice-box {
            background: #fffbeb;
            border: 1px solid #fde68a;
            border-radius: 8px;
            padding: 12px 14px;
            font-size: 13px;
            color: #78350f;
            margin-bottom: 24px;
          }
          .rx-footer {
            margin-top: 36px;
            padding-top: 16px;
            border-top: 1px dashed #cbd5e1;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            font-size: 12px;
            color: #64748b;
          }
          .signature-box {
            text-align: right;
            color: #0f172a;
          }
          @media print {
            body { padding: 0; }
            .rx-container { border: 2px solid #059669; }
          }
        </style>
      </head>
      <body>
        <div class="rx-container">
          <div class="brand-header">
            <img src="${logoAbsoluteUrl}" alt="GS Health Care Logo" class="gs-logo-img" />
            <h1>GS Health Care</h1>
            <p class="tagline">Multi-Specialty Outpatient & Digital Clinical Portal</p>
          </div>

          <div class="doctor-visit-bar">
            <div class="doc-info-block">
              <span>Consulting Doctor</span>
              <strong>Dr. ${pres.doctor_name}</strong>
            </div>
            <div class="visit-date-block">
              <span>Visit Date</span>
              <strong>${visitDate}</strong>
            </div>
          </div>

          <div class="patient-strip">
            <div><span>Patient Name</span><strong>${patientName}</strong></div>
            <div><span>Patient ID</span><strong>${patientId}</strong></div>
            <div><span>Contact / Appt</span><strong>+91 ${patientPhone} (${pres.appointment_id || 'OPD'})</strong></div>
          </div>

          ${
            pres.weight || pres.bp
              ? `
            <div class="vitals-strip">
              <div><span>Patient Weight</span><strong>${pres.weight || 'Not Recorded'}</strong></div>
              <div><span>Blood Pressure (BP)</span><strong>${pres.bp || 'Not Recorded'}</strong></div>
            </div>
          `
              : ''
          }

          <div class="section-label">Diagnosis / Clinical Findings</div>
          <div class="diagnosis-box">${pres.diagnosis}</div>

          <div class="section-label"><span class="rx-symbol">℞</span> Prescribed Medicines</div>
          <table>
            <thead>
              <tr>
                <th style="width: 45px;">#</th>
                <th>Medicine Name</th>
                <th>Dosage</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              ${medicinesRows || '<tr><td colspan="4">No medicines prescribed.</td></tr>'}
            </tbody>
          </table>

          ${
            pres.lab_tests
              ? `
            <div class="section-label">Recommended Lab Tests</div>
            <div class="lab-box">${pres.lab_tests}</div>
          `
              : ''
          }

          ${
            pres.advice
              ? `
            <div class="section-label">Clinical Advice & Instructions</div>
            <div class="advice-box">${pres.advice}</div>
          `
              : ''
          }

          <div class="rx-footer">
            <div>GS Health Care • Digitally Verified Medical Record</div>
            <div class="signature-box">
              <strong>Dr. ${pres.doctor_name}</strong><br/>
              Authorized Signature
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (isLoading) {
    return (
      <div className="patient-loading-screen">
        <h2>Loading records... 🏥</h2>
      </div>
    );
  }

  return (
    <div className="patient-dashboard">
      <aside className="dashboard-sidebar">
        <div className="user-profile">
          {patientData.profile.photo ? (
            <img
              src={`${UPLOADS_URL}${patientData.profile.photo}`}
              alt="Profile"
              className="sidebar-profile-photo"
            />
          ) : (
            <div className="avatar">👤</div>
          )}
          <h3>{patientData.profile.name}</h3>
          <p>Patient ID: {patientData.profile.application_id}</p>
        </div>
        <ul className="sidebar-menu">
          <li
            className={activeTab === 'Overview' ? 'active' : ''}
            onClick={() => {
              setActiveTab('Overview');
              setIsEditing(false);
            }}
          >
            Dashboard Overview
          </li>
          <li
            className={activeTab === 'Profile' ? 'active' : ''}
            onClick={() => {
              setActiveTab('Profile');
              setIsEditing(false);
            }}
          >
            My Profile
          </li>
          <li
            className={activeTab === 'History' ? 'active' : ''}
            onClick={() => {
              setActiveTab('History');
              setIsEditing(false);
            }}
          >
            Medical History
          </li>
          <li>
            <Link to="/appointment" className="sidebar-link">
              Book New Appointment
            </Link>
          </li>
          <li
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              window.location.href = '/';
            }}
          >
            Logout
          </li>
        </ul>
      </aside>

      <main className="dashboard-content" ref={contentRef}>
        {activeTab === 'Overview' && (
          <div className="overview-section">
            <h2>Welcome back, {patientData.profile.name.split(' ')[0]}! 👋</h2>
            <p className="subtitle">Here is an overview of your health schedule.</p>
            <div className="dashboard-cards">
              <div className="dash-card primary-card">
                <div className="card-header">
                  <h3>Upcoming Appointment</h3>
                </div>
                <div className="card-body">
                  {patientData.appointments && patientData.appointments.length > 0 ? (
                    <div className="appointment-info-box">
                      <p>
                        <strong>Status:</strong>{' '}
                        <span className="status-badge">{patientData.appointments[0].status}</span>
                      </p>
                      <p>
                        <strong>Date:</strong> {patientData.appointments[0].date}
                      </p>
                      <p>
                        <strong>Time:</strong> {patientData.appointments[0].time_slot}
                      </p>
                    </div>
                  ) : (
                    <div className="empty-state-container">
                      <p>No upcoming appointments.</p>
                      <Link to="/appointment" className="quick-book-link">
                        Book one now &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <div className="dash-card action-card">
                <h3>Quick Actions</h3>
                <Link to="/appointment" className="btn-action">
                  📅 Book Appointment
                </Link>
                <button className="btn-action outline" onClick={() => setActiveTab('History')}>
                  📄 View Prescriptions
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Profile' && (
          <div className="profile-section">
            <div className="profile-section-header">
              <h2>My Profile Details</h2>
              {!isEditing && (
                <button className="btn-corner-edit" onClick={() => setIsEditing(true)}>
                  ✏️ Edit Profile
                </button>
              )}
            </div>

            {!isEditing ? (
              <div className="dash-card profile-details-card">
                <div className="profile-details-grid">
                  <div>
                    <h4 className="detail-label">Full Name</h4>
                    <p className="detail-value">{patientData.profile.name}</p>
                  </div>
                  <div>
                    <h4 className="detail-label">Email Address</h4>
                    <p className="detail-value">{patientData.profile.email}</p>
                  </div>
                  <div>
                    <h4 className="detail-label">Phone Number</h4>
                    <p className="detail-value">+91 {patientData.profile.phone}</p>
                  </div>
                  <div>
                    <h4 className="detail-label">Identity Document Status</h4>
                    <p className="detail-value">Verified Profile (12-Digit Entry Checked)</p>
                  </div>
                </div>
                <hr className="section-divider" />
                <div>
                  <h4 className="detail-label docs-label">Identity Documents</h4>
                  {patientData.profile.aadhar_card ? (
                    <a
                      href={`${UPLOADS_URL}${patientData.profile.aadhar_card}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-action outline document-btn"
                    >
                      📄 View Identity File
                    </a>
                  ) : (
                    <p className="error-text">No document file on record.</p>
                  )}
                </div>
              </div>
            ) : (
              <EditProfileComp
                initialData={patientData.profile}
                role="Patient"
                onCancel={() => setIsEditing(false)}
                onUpdateSuccess={(updatedFields) => {
                  setPatientData({
                    ...patientData,
                    profile: { ...patientData.profile, ...updatedFields }
                  });
                  setIsEditing(false);
                }}
              />
            )}
          </div>
        )}

        {activeTab === 'History' && (
          <div className="history-section">
            <h2>Medical History & Prescriptions</h2>
            <p className="subtitle">Download official GS Health Care digital prescriptions from your visits.</p>
            <div className="history-list">
              {prescriptions.length > 0 ? (
                prescriptions.map((pres) => (
                  <div key={pres._id} className="prescription-card">
                    <div className="prescription-header">
                      <div>
                        <h4 className="diagnosis-title">Diagnosis: {pres.diagnosis}</h4>
                        <p className="doctor-meta">
                          By <strong>Dr. {pres.doctor_name}</strong> on {pres.date}
                        </p>
                      </div>
                      <button onClick={() => downloadPDF(pres)} className="btn-download">
                        📄 Download PDF
                      </button>
                    </div>

                    {(pres.weight || pres.bp) && (
                      <div className="vitals-badge-row">
                        {pres.weight && <span className="vital-chip">⚖️ Weight: {pres.weight}</span>}
                        {pres.bp && <span className="vital-chip">🩺 BP: {pres.bp}</span>}
                      </div>
                    )}

                    <div className="medicine-summary-box">
                      <p className="medicines-heading">Medicines:</p>
                      <ul className="medicines-list">
                        {pres.medicines.map((m, i) => (
                          <li key={i}>
                            <strong>{m.name}</strong> — {m.dosage}{' '}
                            {m.duration ? `(${m.duration})` : ''}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {pres.lab_tests && (
                      <div className="lab-summary-box">
                        <strong>🧪 Lab Tests:</strong> {pres.lab_tests}
                      </div>
                    )}

                    {pres.advice && (
                      <div className="advice-summary-box">
                        <strong>Advice:</strong> {pres.advice}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="no-data-card">
                  <p>No prescriptions found.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;