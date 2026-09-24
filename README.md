# Hospital-Management-System
# 🏥 Hospital Management System (HMS)

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

A full-stack Hospital Management System designed to streamline hospital administration, patient admissions, doctor allocations, appointment scheduling, and electronic medical records.

---

## 📌 Quick Links

* [API Documentation](#-api-endpoints)
* [Local Setup](#-local-development)
* [Tech Stack](#-tech-stack)
* [Project Structure](#-project-structure)
* [Contributing Guidelines](#-contributing)

---

## ✨ Key Features

* ✅ **Patient Management:** Complete lifecycle handling including registration, discharge, and medical histories.
* ✅ **Doctor Portal:** Shift allocations, specialization tracking, and dedicated patient queues.
* ✅ **Appointment Scheduling:** Real-time booking slots with automatic conflict detection.
* ✅ **Medical Billing:** Invoicing, treatment fee calculations, and payment tracking.
* ✅ **Role-Based Access Control (RBAC):** Distinct permissions for Admins, Doctors, Receptionists, and Patients.
* ✅ **Responsive Dashboard:** Built with React and Vite for sub-second page transitions.

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js, Vite | UI Rendering & Single-Page Application (SPA) |
| **Styling** | React-Bootstrap, Custom CSS | Modern UI components and responsive styling |
| **Backend** | Node.js, Express.js | REST API services and request handling |
| **Database** | MongoDB / MySQL | Secure storage for patient and clinical data |
| **Authentication** | JWT, bcrypt | Session tokens and password hashing |
| **Network Client** | Axios | Frontend-to-backend API communication |

---

## 📁 Project Structure

```text
Hospital-Management-System/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection files
│   │   ├── controllers/     # Business logic for routes
│   │   ├── middleware/      # Auth & validation checks
│   │   ├── models/          # Database schemas
│   │   ├── routes/          # Express route definitions
│   │   └── server.js        # Main server entry point
│   ├── .env.example         # Template for environment variables
│   └── package.json
├── frontend/
│   ├── public/              # Static assets & favicon
│   ├── src/
│   │   ├── assets/          # Project images & icons
│   │   ├── components/      # Reusable UI widgets
│   │   ├── pages/           # View layouts (Doctors, Patients, etc.)
│   │   ├── App.jsx          # Route declarations
│   │   └── main.jsx         # Vite root mount
│   ├── vite.config.js       # Vite bundler configurations
│   └── package.json
└── README.md
