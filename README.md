# 🏥 Hospital Management System (HMS)

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)[cite: 2]
![Version](https://img.shields.io/badge/version-1.0.0-blue)[cite: 2]
![License](https://img.shields.io/badge/license-MIT-green)[cite: 2]
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

A modern full-stack Hospital Management Web Application built with React, Vite, Express, and MongoDB. The system streamlines patient registrations, user authentication, doctor-patient appointment booking across various departments, and direct messaging with hospital administration.

---

## 📌 Quick Links

* [Key Features](#-key-features)
* [Tech Stack](#-tech-stack)
* [Project Structure](#-project-structure)
* [Hospital Departments](#-hospital-departments)
* [Local Development](#-local-development)
* [API Endpoints](#-api-endpoints)
* [Contributing](#-contributing)
* [License](#-license)

---

## ✨ Key Features

* 🔐 **Authentication System:** Secure patient/user registration and login powered by JWT and cookies.
* 📅 **Appointment Booking:** Interactive appointment scheduling form allowing patients to select specific doctors, departments, and time slots.
* 🏥 **Department Directory:** Browse clinical departments (Cardiology, Dermatology, Neurology, Oncology, Orthopedics, Pediatrics, Radiology, etc.).
* 💬 **Contact & Message Center:** Direct inquiry and message dispatch to hospital administrators via `MessageForm`.
* 📱 **Responsive UI:** Built with Vite and React using responsive layouts and `react-multi-carousel` for smooth interactive displays.
* 🔔 **Instant Feedback:** Toast notifications integrated across forms using `react-toastify`.

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React.js (v18+) | Component-driven Single-Page Application (SPA) |
| **Build Tool** | Vite | Lightning-fast development server and optimized bundler |
| **Routing** | React Router DOM | Client-side page navigation |
| **UI Components** | React Icons, React Multi Carousel | Icons and responsive department carousels |
| **Alerts & Modals** | React-Toastify | Client notifications and feedback |
| **HTTP Client** | Axios | Frontend-to-backend API communication |
| **Backend (Server)** | Node.js, Express.js | REST API routing and business logic |
| **Database** | MongoDB & Mongoose | Document storage for users, messages, and appointments |

---

## 📁 Project Structure

```text
Hospital-Management-System/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── Components/
│   │   │   ├── EditProfileComp.css
│   │   │   ├── EditProfileComp.jsx
│   │   │   ├── Footer.css
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.css
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── Pages/
│   │   │   ├── Doctor/
│   │   │   │   ├── DoctorDashboard.css
│   │   │   │   ├── DoctorDashboard.jsx
│   │   │   │   ├── PatientQueue.css
│   │   │   │   └── PatientQueue.jsx
│   │   │   ├── Manager/
│   │   │   │   ├── ManagerDashboard.css
│   │   │   │   ├── ManagerDashboard.jsx
│   │   │   │   ├── ManageSchedule.css
│   │   │   │   └── ManageSchedule.jsx
│   │   │   ├── Patient/
│   │   │   │   ├── BookAppointment.css
│   │   │   │   ├── BookAppointment.jsx
│   │   │   │   ├── PatientDashboard.css
│   │   │   │   └── PatientDashboard.jsx
│   │   │   └── Public/
│   │   │       ├── CertifiedExcellence.css
│   │   │       ├── CertifiedExcellence.jsx
│   │   │       ├── Contact.css
│   │   │       ├── Contact.jsx
│   │   │       ├── Home.css
│   │   │       ├── Home.jsx
│   │   │       ├── LoginRegister.css
│   │   │       ├── LoginRegister.jsx
│   │   │       ├── PublicSchedule.css
│   │   │       ├── PublicSchedule.jsx
│   │   │       ├── videoss.css
│   │   │       └── videoss.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── vite.config.js
│
├── hospital-management-system-backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── appointmentController.js
│   │   ├── authController.js
│   │   ├── doctorController.js
│   │   ├── managerController.js
│   │   ├── patientController.js
│   │   ├── prescriptionController.js
│   │   ├── profileController.js
│   │   └── scheduleController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── appointmentModel.js
│   │   ├── counterModel.js
│   │   ├── doctorModel.js
│   │   ├── managerModel.js
│   │   ├── patientModel.js
│   │   ├── prescriptionModel.js
│   │   └── scheduleModel.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── managerRoutes.js
│   │   ├── patientRoutes.js
│   │   ├── prescriptionRoutes.js
│   │   └── profileRoutes.js
│   ├── uploads/
│   ├── .env
│   ├── .gitignore
│   ├── index.js
│   ├── package-lock.json
│   ├── package.json
│   └── vercel.json
│
└── README.md
```[cite: 3, 4, 5]
