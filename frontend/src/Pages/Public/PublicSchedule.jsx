import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './PublicSchedule.css';

const PublicSchedule = () => {
  // Mock Data (This will later come from your backend MongoDB/Express API)
  const mockSchedule = [
    { id: 'DR1001', name: 'Dr. Ramesh Sharma', department: 'Cardiology', day: 'Monday', time: '09:00 AM - 01:00 PM' },
    { id: 'DR1002', name: 'Dr. Anita Desai', department: 'Neurology', day: 'Monday', time: '10:00 AM - 02:00 PM' },
    { id: 'DR1003', name: 'Dr. John Smith', department: 'Orthopedics', day: 'Tuesday', time: '11:00 AM - 04:00 PM' },
    { id: 'DR1004', name: 'Dr. Priya Patel', department: 'General Medicine', day: 'Wednesday', time: '08:00 AM - 12:00 PM' },
    { id: 'DR1001', name: 'Dr. Ramesh Sharma', department: 'Cardiology', day: 'Thursday', time: '02:00 PM - 06:00 PM' },
    { id: 'DR1005', name: 'Dr. Ali Khan', department: 'Pediatrics', day: 'Friday', time: '09:00 AM - 01:00 PM' },
  ];

  // State for search filters
  const [filterDay, setFilterDay] = useState('');
  const [filterDept, setFilterDept] = useState('');

  // Refs for GSAP animation
  const cardsRef = useRef([]);
  const headerRef = useRef(null);

  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useEffect(() => {
    // Animate Header
    gsap.from(headerRef.current, { y: -20, opacity: 0, duration: 0.8, ease: "power2.out" });
    
    // Animate Cards (Resetting refs array to avoid duplicates on re-render)
    cardsRef.current = [];
  }, []);

  // Animate cards every time the filtered list changes
  useEffect(() => {
    if (cardsRef.current.length > 0) {
      gsap.fromTo(cardsRef.current, 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [filterDay, filterDept]);

  // Filtering Logic
  const filteredSchedule = mockSchedule.filter(doc => {
    const matchDay = filterDay === '' || doc.day === filterDay;
    const matchDept = filterDept === '' || doc.department.toLowerCase().includes(filterDept.toLowerCase());
    return matchDay && matchDept;
  });

  return (
    <div className="schedule-page">
      <div className="schedule-container">
        
        {/* Header & Filters */}
        <div className="schedule-header" ref={headerRef}>
          <h2>Doctor Availability Schedule</h2>
          <p>Find the right specialist at the right time.</p>
          
          <div className="filter-bar">
            <div className="filter-group">
              <label>Filter by Day</label>
              <select value={filterDay} onChange={(e) => setFilterDay(e.target.value)}>
                <option value="">All Days</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Search Department</label>
              <input 
                type="text" 
                placeholder="e.g. Cardiology" 
                value={filterDept}
                onChange={(e) => setFilterDept(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="schedule-grid">
          {filteredSchedule.length > 0 ? (
            filteredSchedule.map((doc, index) => (
              <div className="doctor-card" key={`${doc.id}-${doc.day}`} ref={addToRefs}>
                <div className="doc-header">
                  <h3>{doc.name}</h3>
                  <span className="doc-id">{doc.id}</span>
                </div>
                <div className="doc-body">
                  <p><strong>Department:</strong> {doc.department}</p>
                  <p><strong>Day:</strong> <span className="highlight-day">{doc.day}</span></p>
                  <p><strong>Time:</strong> {doc.time}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No doctors found for the selected filters.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PublicSchedule;