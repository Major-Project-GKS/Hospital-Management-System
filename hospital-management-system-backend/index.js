// hospital-management-system-backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Ensure uploads directory exists on Render ephemeral storage
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ==========================================
// MIDDLEWARE (PRODUCTION & LOCAL CORS)
// ==========================================
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      if (origin.endsWith('.onrender.com')) {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serving static uploads
app.use('/uploads', express.static(uploadsDir));

// ==========================================
// ROUTES
// ==========================================
app.get('/', (req, res) => {
  res.send('Hospital Management System API is running...');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patient', require('./routes/patientRoutes'));
app.use('/api/doctor', require('./routes/doctorRoutes'));
app.use('/api/manager', require('./routes/managerRoutes'));
app.use('/api/appointment', require('./routes/appointmentRoutes'));
app.use('/api/prescription', require('./routes/prescriptionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));

// ==========================================
// GLOBAL & MULTER ERROR HANDLING
// ==========================================
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'Uploaded file is too large. Maximum allowed size is 10MB.'
    });
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong on the server!'
  });
});

// ==========================================
// SERVER INITIALIZATION (0.0.0.0 FOR RENDER)
// ==========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server started on port ${PORT}`);
  console.log(`📅 Appointment system active at /api/appointment`);
  console.log(`💊 Prescription system active at /api/prescription`);
  console.log(`⚙️  Profile customization engine active at /api/profile`);
});