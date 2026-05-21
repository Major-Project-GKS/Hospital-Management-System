import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './PublicSchedule.css';

const PublicSchedule = () => {
  const [doctors, setDoctors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();
  // Standardized URL base (removed trailing slashes to prevent route parsing dropouts)
  const UPLOADS_URL = 'http://localhost:5000/uploads/';

  useEffect(() => {
    const fetchPublicDirectory = async () => {
      try {
        // 1. Fetch doctors independently from the core endpoint
        const docsRes = await axios.get('http://localhost:5000/api/doctor');
        setDoctors(docsRes.data.data || []);
        
        // 2. Safe, decoupled fallback block to load rosters without crashing main state
        try {
          const scheduleRes = await axios.get('http://localhost:5000/api/appointment/schedule/all');
          setSchedules(scheduleRes.data.data || []);
        } catch (scheduleErr) {
          console.warn("⚠️ Shift rosters empty or unconfigured yet:", scheduleErr);
          setSchedules([]); // Fallback grace state to prevent app failure
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error loading directory data:", err);
        toast.error("Unable to load medical staff directory list.");
        setIsLoading(false);
      }
    };
    fetchPublicDirectory();
  }, []);

  const handleBookClick = (doctorId) => {
    localStorage.setItem('bookingDoctorId', doctorId);
    navigate('/appointment');
  };

  const filteredDoctors = doctors.filter(doc => {
    if (selectedSpecialization === 'All') return true;
    return doc.department?.trim().toLowerCase() === selectedSpecialization.trim().toLowerCase();
  });

  if (isLoading) {
    return (
      <div className="directory-loading-container">
        <div className="pulse-loader">🏥</div>
        <h2>Syncing Specialist Roster Matrices...</h2>
      </div>
    );
  }

  return (
    <div className="public-directory-wrapper single-screen-frame">
      {/* Compact Header */}
      <header className="directory-hero compact-hero">
        <div className="hero-content">
          <h1>Our Specialized Medical Staff</h1>
          <p>Find trusted medical professionals and view real-time dynamic day availability options.</p>
        </div>
        
        <div className="filter-controls-container">
          <select 
            value={selectedSpecialization} 
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="specialization-select-dropdown"
          >
            <option value="All">All Specializations</option>
            <option value="General Medicine">General Medicine</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
          </select>
        </div>
      </header>

      {/* Main Layout Area */}
      {filteredDoctors.length > 0 ? (
        <div className="directory-grid-matrix horizontal-cards">
          {filteredDoctors.map((doc) => {
            const docRosters = schedules.filter(s => s.doctor_id === doc.doctor_id);

            return (
              <div key={doc._id} className="doctor-directory-card horizontal-split">
                {/* Left Side: Photo Frame */}
                <div className="card-image-left-wrapper">
                  {doc.photo ? (
                    <img src={`${UPLOADS_URL}${doc.photo}`} alt={`Dr. ${doc.name}`} className="doctor-card-img-contain" />
                  ) : (
                    <div className="doctor-fallback-avatar">👨‍⚕️</div>
                  )}
                  <span className="department-badge-pill-corner">{doc.department}</span>
                </div>

                {/* Right Side: Data Content */}
                <div className="card-body-right-content">
                  <div className="identity-block-row">
                    <h3>Dr. {doc.name}</h3>
                    <span className="doctor-id-pill">ID: {doc.doctor_id}</span>
                  </div>

                  <div className="demographic-metadata-row-grid">
                    <p><strong>Exp:</strong> {doc.experience} Yrs</p>
                    <p><strong>Lang:</strong> {doc.comfortable_language || 'Odia, Eng'}</p>
                    <p><strong>Region:</strong> {doc.region_city || 'Odisha'}</p>
                  </div>

                  <div className="availability-schedule-mini-timeline">
                    <h5>Operational Duty Roster</h5>
                    {docRosters.length > 0 ? (
                      <div className="roster-badge-strip-mini">
                        {docRosters.map((sched) => (
                          <div key={sched._id} className="active-day-time-pill-mini">
                            <span className="pilled-day-name-mini">{sched.day_of_week}:</span>
                            <span className="pilled-time-frame-mini">{sched.shift_start} - {sched.shift_end}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-active-roster-callout-mini">No active shifts assigned.</p>
                    )}
                  </div>

                  <button 
                    onClick={() => handleBookClick(doc.doctor_id)} 
                    className="btn-trigger-appointment-booking-mini"
                  >
                    📅 Book Appointment
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-directory-state">
          <h3>No medical personnel found matching criteria.</h3>
        </div>
      )}
    </div>
  );
};

export default PublicSchedule;