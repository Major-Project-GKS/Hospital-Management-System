import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './PatientQueue.css';

const PatientQueue = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Local Mock State for the Queue
  const [queue, setQueue] = useState([
    { id: 'AP1042', serial: 1, name: 'Rahul Verma', time: '09:00 AM', status: 'Waiting' },
    { id: 'AP1045', serial: 2, name: 'Priya Sharma', time: '09:15 AM', status: 'Waiting' },
    { id: 'AP1050', serial: 3, name: 'Amit Kumar', time: '09:30 AM', status: 'Waiting' },
    { id: 'AP1055', serial: 4, name: 'Sneha Gupta', time: '09:45 AM', status: 'Waiting' },
  ]);

  const tableBodyRef = useRef(null);

  // GSAP Animation for table rows
  useEffect(() => {
    if (tableBodyRef.current) {
      gsap.fromTo(tableBodyRef.current.children, 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, []);

  // Handlers
  const handleStatusChange = (id, newStatus) => {
    setQueue(prevQueue => prevQueue.map(patient => 
      patient.id === id ? { ...patient, status: newStatus } : patient
    ));
  };

  const handleUpload = (e, patientName) => {
    const file = e.target.files[0];
    if (file) {
      alert(`Prescription uploaded successfully for ${patientName}! File: ${file.name}`);
    }
  };

  // Filter Logic
  const filteredQueue = queue.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="patient-queue-component">
      <div className="queue-header">
        <h2>Today's Appointments</h2>
        <input 
          type="text" 
          placeholder="Search name or Appt ID..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="queue-search"
        />
      </div>

      <div className="queue-table-wrapper">
        <table className="queue-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Appt ID</th>
              <th>Patient Name</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody ref={tableBodyRef}>
            {filteredQueue.length > 0 ? (
              filteredQueue.map((patient) => (
                <tr key={patient.id} className={patient.status.toLowerCase()}>
                  <td><strong>#{patient.serial}</strong></td>
                  <td>{patient.id}</td>
                  <td>{patient.name}</td>
                  <td>{patient.time}</td>
                  <td>
                    <span className={`status-pill ${patient.status.toLowerCase()}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="queue-actions">
                    {patient.status === 'Waiting' && (
                      <>
                        <button className="btn-mark complete" onClick={() => handleStatusChange(patient.id, 'Completed')}>✅ Complete</button>
                        <button className="btn-mark absent" onClick={() => handleStatusChange(patient.id, 'Absent')}>❌ Absent</button>
                      </>
                    )}
                    {patient.status === 'Completed' && (
                      <div className="upload-container">
                        <label htmlFor={`presc-${patient.id}`} className="btn-presc">📄 Upload Prescription</label>
                        <input 
                          type="file" 
                          id={`presc-${patient.id}`} 
                          accept=".pdf, image/*"
                          style={{ display: 'none' }} 
                          onChange={(e) => handleUpload(e, patient.name)}
                        />
                      </div>
                    )}
                    {patient.status === 'Absent' && (
                      <span className="text-muted">No actions available</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="queue-empty">No patients match your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientQueue;