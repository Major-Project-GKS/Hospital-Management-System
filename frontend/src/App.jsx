import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; // ✅ REQUIRED FOR TOAST STYLES

// Components
import Navbar from './Components/Navbar';
import Footer from './Components/Footer'; 
import Videoss from './Pages/Public/videoss'
import Home from './Pages/Public/Home';
import CertifiedExcellence from './Pages/Public/CertifiedExcellence'; 
import LoginRegister from './Pages/Public/LoginRegister';
import PublicSchedule from './Pages/Public/PublicSchedule';
import Contact from './Pages/Public/Contact'; // ✅ IMPORTED CONTACT PAGE

// Patient Dashboards
import BookAppointment from './Pages/Patient/BookAppointment';
import PatientDashboard from './Pages/Patient/PatientDashboard';

// Doctor Dashboards
import DoctorDashboard from './Pages/Doctor/DoctorDashboard';
import PatientQueue from './Pages/Doctor/PatientQueue';

// Manager Dashboards
import ManagerDashboard from './Pages/Manager/ManagerDashboard';
import ManageSchedule from './Pages/Manager/ManageSchedule';

import './App.css';

function App() {
  return (
    <Router>
      {/* Navbar is common across all pages */}
      <Navbar />

      {/* ✅ TOAST CONTAINER */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Wrapping Routes ensures the Footer is pushed to the bottom of the page */}
      <div style={{ minHeight: 'calc(100vh - 80px)' }}>
        <Routes>
          {/* ✅ Render BOTH Home and CertifiedSection on the main "/" path */}
          <Route 
            path="/" 
            element={
              <>
                <Videoss/>
                <Home />
                <CertifiedExcellence />
              </>
            } 
          />
          
          {/* Public Routes */}
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/doctors" element={<PublicSchedule />} /> {/* ✅ MATCHES NAVBAR ROUTE */}
          <Route path="/contact" element={<Contact />} /> {/* ✅ ACCESSIBLE PUBLIC CONTACT ROUTE */}
          
          {/* Patient Routes */}
          <Route path="/appointment" element={<BookAppointment />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />

          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/queue" element={<PatientQueue />} />

          {/* Manager Routes */}
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/manager/schedule" element={<ManageSchedule />} />
        </Routes>
      </div>

      {/* Footer is common across all pages */}
      <Footer /> 
    </Router>
  );
}

export default App;