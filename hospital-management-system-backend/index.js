require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// ==========================================
// MIDDLEWARE (UPDATED WITH ADVANCED CORS PATH LABELS) ✅
// ==========================================
app.use(cors({
  origin: "http://localhost:5173", // Points directly to your frontend Vite dev node
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Serving static uploads (Photos, Aadhar PDFs, Proofs)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// ROUTES
// ==========================================

// Simple Health Check
app.get('/', (req, res) => {
  res.send('Hospital Management System API is running...');
});

// 1. Authentication (Login for everyone)
app.use('/api/auth', require('./routes/authRoutes')); 

// 2. Patient Routes (Registration, Dashboard, etc.)
app.use('/api/patient', require('./routes/patientRoutes'));

// 3. Doctor Routes (Registration, Profile Data, etc.)
app.use('/api/doctor', require('./routes/doctorRoutes'));

// 4. Manager Routes (Registration, etc.)
app.use('/api/manager', require('./routes/managerRoutes'));

// 5. Appointment Routes (Booking & Status Updates)
app.use('/api/appointment', require('./routes/appointmentRoutes'));

// 6. Digital Prescription Routes
app.use('/api/prescription', require('./routes/prescriptionRoutes'));

// 7. Admin/Manager Dashboard Routes (Stats, etc.)
app.use('/api/admin', require('./routes/adminRoutes')); 

// 8. Universal Profile Editing Routes
app.use('/api/profile', require('./routes/profileRoutes'));

// ==========================================
// ERROR HANDLING (Global)
// ==========================================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong on the server!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
  console.log(`📂 Uploads accessible at http://localhost:${PORT}/uploads`);
  console.log(`📅 Appointment system active at /api/appointment`);
  console.log(`💊 Prescription system active at /api/prescription`);
  console.log(`⚙️  Profile customization engine active at /api/profile`);
});