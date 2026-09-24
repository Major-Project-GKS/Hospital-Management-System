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
├── backend/
│   ├── config/              # DB connection config
│   ├── controllers/         # Business logic (user, appointment, message)
│   ├── middlewares/         # Auth, error handling, catchAsyncErrors
│   ├── models/              # Mongoose schemas (User, Appointment, Message)
│   ├── router/              # Express API routes
│   ├── server.js            # Server entry point
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── public/              # Static branding and department images
    │   ├── departments/     # cardio.jpg, neuro.jpg, ortho.jpg, etc.
    │   ├── about.png
    │   ├── contact.png
    │   ├── hero.png
    │   ├── logo.png
    │   ├── signin.png
    │   └── signupheader.png
    ├── src/
    │   ├── components/      # Reusable UI components
    │   │   ├── AppointmentForm.jsx
    │   │   ├── Biography.jsx
    │   │   ├── Departments.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Hero.jsx
    │   │   ├── MessageForm.jsx
    │   │   └── Navbar.jsx
    │   ├── Pages/           # Application views
    │   │   ├── AboutUs.jsx
    │   │   ├── Appointment.jsx
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── App.css
    │   ├── App.jsx          # Route configuration
    │   └── main.jsx         # Vite entry point
    ├── vite.config.js
    └── package.json
