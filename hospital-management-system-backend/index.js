require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // Added for directory path handling
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // Added to help with form-data parsing

// ✅ FIXED: Better way to serve the static uploads folder
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

// 3. Doctor Routes (Registration, schedule, etc.)
app.use('/api/doctor', require('./routes/doctorRoutes'));

// 4. Manager Routes (Registration, etc.)
app.use('/api/manager', require('./routes/managerRoutes'));

// 5. Admin/Manager Dashboard Routes (Stats, etc.)
app.use('/api/admin', require('./routes/adminRoutes')); 

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
});