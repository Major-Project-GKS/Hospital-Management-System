import React, { useState } from 'react';
import './ManageSchedule.css';

const ManageSchedule = () => {
  // Form State
  const [scheduleData, setScheduleData] = useState({
    day: '',
    department: '',
    doctorId: '',
    startTime: '',
    endTime: ''
  });

  // Mock Doctors (Will come from Backend later)
  const availableDoctors = [
    { id: 'DR1001', name: 'Dr. Ramesh Sharma', department: 'Cardiology' },
    { id: 'DR1002', name: 'Dr. Anita Desai', department: 'Neurology' },
    { id: 'DR1003', name: 'Dr. John Smith', department: 'Orthopedics' },
  ];

  // Mock Saved Schedules
  const [savedSchedules, setSavedSchedules] = useState([]);

  // Filter doctors based on selected department in the form
  const filteredDoctors = availableDoctors.filter(doc => doc.department === scheduleData.department);

  const handleSaveSchedule = (e) => {
    e.preventDefault();
    const selectedDoc = availableDoctors.find(d => d.id === scheduleData.doctorId);
    
    const newSchedule = {
      ...scheduleData,
      doctorName: selectedDoc.name,
      id: Date.now() // temporary ID
    };

    setSavedSchedules([...savedSchedules, newSchedule]);
    alert('Schedule Saved Successfully!');
    // Reset form
    setScheduleData({ day: '', department: '', doctorId: '', startTime: '', endTime: '' });
  };

  return (
    <div className="manage-schedule-container">
      <div className="schedule-header">
        <h2>Manage Doctor Schedules</h2>
        <button onClick={() => window.history.back()} className="btn-back">← Back to Dashboard</button>
      </div>

      <div className="schedule-grid">
        {/* Form Panel */}
        <div className="schedule-form-panel">
          <h3>Create New Duty Shift</h3>
          <form onSubmit={handleSaveSchedule}>
            <div className="form-group">
              <label>Select Day</label>
              <select required value={scheduleData.day} onChange={(e) => setScheduleData({...scheduleData, day: e.target.value})}>
                <option value="">Choose a day...</option>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Department</label>
              <select required value={scheduleData.department} onChange={(e) => setScheduleData({...scheduleData, department: e.target.value})}>
                <option value="">Choose department...</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
              </select>
            </div>

            <div className="form-group">
              <label>Select Doctor</label>
              <select required value={scheduleData.doctorId} disabled={!scheduleData.department} onChange={(e) => setScheduleData({...scheduleData, doctorId: e.target.value})}>
                <option value="">Choose doctor...</option>
                {filteredDoctors.map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.name} ({doc.id})</option>
                ))}
              </select>
            </div>

            <div className="time-group">
              <div className="form-group">
                <label>Start Time</label>
                <input type="time" required value={scheduleData.startTime} onChange={(e) => setScheduleData({...scheduleData, startTime: e.target.value})} />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input type="time" required value={scheduleData.endTime} onChange={(e) => setScheduleData({...scheduleData, endTime: e.target.value})} />
              </div>
            </div>

            <button type="submit" className="btn-submit-schedule">Save Schedule</button>
          </form>
        </div>

        {/* List Panel */}
        <div className="schedule-list-panel">
          <h3>Current Active Schedules</h3>
          <div className="active-schedules">
            {savedSchedules.length === 0 ? (
              <p className="no-data">No schedules configured yet.</p>
            ) : (
              savedSchedules.map(sched => (
                <div key={sched.id} className="schedule-item">
                  <div className="sched-doc">
                    <h4>{sched.doctorName}</h4>
                    <span>{sched.department}</span>
                  </div>
                  <div className="sched-time">
                    <strong>{sched.day}</strong>
                    <p>{sched.startTime} to {sched.endTime}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSchedule;