require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// ==========================================
// MIDDLEWARE (UPDATED FOR PRODUCTION & LOCAL CORS) ✅
// ==========================================
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL // Will hold your future frontend Render URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Render health checks)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Allow any onrender.com preview domains for ease of deployment
    if (origin.endsWith('.onrender.com')) {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS'));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Serving static uploads
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

// ==========================================
// SERVER INITIALIZATION (BOUND TO 0.0.0.0 FOR RENDER) ✅
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server started on port ${PORT}`);
  console.log(`📅 Appointment system active at /api/appointment`);
  console.log(`💊 Prescription system active at /api/prescription`);
  console.log(`⚙️  Profile customization engine active at /api/profile`);
});