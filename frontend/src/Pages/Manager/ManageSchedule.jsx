import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './ManageSchedule.css';

const ManageSchedule = () => {
  const [doctorsList, setDoctorsList] = useState([]);
  const [rosters, setRosters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State Values (Synced with production schema keys)
  const [formData, setFormData] = useState({
    doctor_id: '',
    day_of_week: 'Monday',
    department: 'General Medicine',
    shift_start: '09:00',
    shift_end: '17:00',
    max_patients: 20
  });

  // DECOUPLED DATA FETCHING ENGINE: Separated streams prevent cascading loading freezes
  useEffect(() => {
    const fetchRosterData = async () => {
      setIsLoading(true);
      
      // 1. Fetch Registered Doctors Independently
      try {
        const docsRes = await axios.get('http://localhost:5000/api/doctor');
        const verifiedDoctors = docsRes.data.data || docsRes.data || [];
        setDoctorsList(verifiedDoctors);
      } catch (docErr) {
        console.error("❌ Doctor dependency loading failed:", docErr);
        toast.error("Failed to load registered medical staff.");
        setDoctorsList([]);
      }

      // 2. Fetch Active Roster Shifts Safely in a Standalone Block
      try {
        const rosterRes = await axios.get('http://localhost:5000/api/appointment/schedule/all');
        const verifiedRosters = rosterRes.data.data || rosterRes.data || [];
        setRosters(verifiedRosters);
      } catch (rosterErr) {
        console.warn("⚠️ Schedule configurations empty or unmapped yet:", rosterErr);
        setRosters([]); // Fallback keeps UI functional if database is clear
      }

      setIsLoading(false);
    };

    fetchRosterData();
  }, []);

  // Cascading Filter with robust case-insensitive and whitespace-trimmed string matching
  const filteredDoctors = doctorsList.filter(
    doc => doc.department?.trim().toLowerCase() === formData.department?.trim().toLowerCase()
  );

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Reset the selected doctor if the manager alters the department line layout
  const handleDepartmentChange = (e) => {
    setFormData({
      ...formData,
      department: e.target.value,
      doctor_id: '' // Clears selected doctor code to avoid cross-department assignment bugs
    });
  };

  // UPDATED FORM SUBMISSION PROCESS
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.doctor_id) {
      toast.warning("Please choose an assigned medical professional.");
      return;
    }

    try {
      // 1. Trace matching doctor details out of the list variable array map to catch their name
      const selectedDocObj = doctorsList.find(doc => doc.doctor_id === formData.doctor_id);
      const docName = selectedDocObj ? selectedDocObj.name : '';

      // 2. Wrap state with the additional parameters needed by your backend mongoose rules
      const submissionPayload = {
        ...formData,
        doctor_name: docName 
      };

      console.log("📤 Submitting complete roster payload:", submissionPayload);

      const res = await axios.post('http://localhost:5000/api/appointment/schedule/save', submissionPayload);
      
      if (res.data.success) {
        toast.success("Roster adjustments updated live!");
        
        // Safe, decoupled fetch block to refresh lists on success
        try {
          const updatedAll = await axios.get('http://localhost:5000/api/appointment/schedule/all');
          setRosters(updatedAll.data.data || updatedAll.data || []);
        } catch (fetchErr) {
          console.error("Could not refresh active schedule listing tracker matrix:", fetchErr);
        }
        
        // Reset form inputs back to fallback positions cleanly
        setFormData({
          doctor_id: '',
          day_of_week: 'Monday',
          department: 'General Medicine',
          shift_start: '09:00',
          shift_end: '17:00',
          max_patients: 20
        });
      }
    } catch (err) {
      console.error("❌ Schedule Save Error:", err);
      const serverFeedbackMsg = err.response?.data?.message || err.response?.data?.error;
      toast.error(serverFeedbackMsg || "Roster processing failure: Schema verification mismatch.");
    }
  };

  if (isLoading) return <div className="schedule-loading-screen"><h2>Compiling Duty Roster Streams... 🏥</h2></div>;

  return (
    <div className="manage-schedule-container">
      <div className="schedule-header">
        <header className="schedule-title-block">
          <h1>Institutional Duty Roster Command</h1>
          <p>Assign registered medical practitioners to dynamic department day-wise configurations.</p>
        </header>
        <button onClick={() => window.history.back()} className="btn-back">← Back to Dashboard</button>
      </div>

      <div className="schedule-workspace-layout">
        {/* LEFT WORKSPACE CARD: ALLOCATION CONTROL FORM */}
        <div className="roster-form-card">
          <h3>Create Duty Node Allocation</h3>
          <form onSubmit={handleFormSubmit} className="roster-form">
            
            <div className="roster-field-group">
              <label>Target Duty Day</label>
              <select name="day_of_week" value={formData.day_of_week} onChange={handleInputChange}>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div className="roster-field-group">
              <label>Operational Department Line</label>
              <select name="department" value={formData.department} onChange={handleDepartmentChange}>
                <option value="General Medicine">General Medicine</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
              </select>
            </div>

            <div className="roster-field-group">
              <label>Select Specialist Practitioner (Filtered by Dept)</label>
              <select 
                name="doctor_id" 
                value={formData.doctor_id} 
                onChange={handleInputChange} 
                required
                disabled={filteredDoctors.length === 0}
              >
                <option value="">
                  {filteredDoctors.length === 0 
                    ? `-- No Doctors Registered in ${formData.department} --` 
                    : `-- Choose Active Doctor (${filteredDoctors.length} available) --`}
                </option>
                {filteredDoctors.map(doc => (
                  <option key={doc._id} value={doc.doctor_id}>
                    Dr. {doc.name} ({doc.doctor_id})
                  </option>
                ))}
              </select>
            </div>

            <div className="time-range-row">
              <div className="roster-field-group">
                <label>Shift Start</label>
                <input type="time" name="shift_start" value={formData.shift_start} onChange={handleInputChange} required />
              </div>
              <div className="roster-field-group">
                <label>Shift End</label>
                <input type="time" name="shift_end" value={formData.shift_end} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="roster-field-group">
              <label>Booking Token Capacity (Max Patients)</label>
              <input type="number" name="max_patients" min="1" max="100" value={formData.max_patients} onChange={handleInputChange} required />
            </div>

            <button type="submit" className="btn-commit-roster">⚡ Commit Duty Schedule</button>
          </form>
        </div>

        {/* RIGHT WORKSPACE CARD: CURRENT ROSTER MASTER LISTING TABLE */}
        <div className="roster-display-card">
          <h3>Active Duty Shifts Registry Matrix</h3>
          <div className="table-overflow-wrapper">
            <table className="roster-master-table">
              <thead>
                <tr>
                  <th>Target Day</th>
                  <th>Medical Staff Name</th>
                  <th>Allocated Department</th>
                  <th>Time Frame</th>
                  <th>Token Load</th>
                </tr>
              </thead>
              <tbody>
                {rosters.length > 0 ? (
                  rosters.map(r => (
                    <tr key={r._id}>
                      <td><span className="day-badge-label">{r.day_of_week}</span></td>
                      <td><strong>Dr. {r.doctor_name || r.doctor_id}</strong></td>
                      <td><span className="dept-pill-text">{r.department}</span></td>
                      <td>{r.shift_start} - {r.shift_end}</td>
                      <td>{r.max_patients} Patients Max</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="empty-roster-text">No operational day-wise allocations currently defined.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSchedule;