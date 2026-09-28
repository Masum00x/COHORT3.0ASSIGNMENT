# 🛒 Full-Stack E-Commerce Platform

A robust, full-stack e-commerce web application built with **Node.js, Express, Mongoose, and React (Tailwind CSS)**. It features secure JWT authentication, role-based access control, multi-image cloud uploads, and complete product management.

---

## ✨ Features

- **🔐 Secure Authentication:** User registration and login powered by JSON Web Tokens (JWT) with password hashing.
- **👥 Role-Based Access Control (RBAC):** Distinct permissions and routes for users, sellers, and administrators.
- **📦 Product Management:** Full CRUD operations for products linked directly to authenticated sellers using Mongoose ObjectIds and references.
- **🖼️ Multi-File Cloud Uploads:** Seamless handling of multiple image uploads using `multer` and cloud storage integration.
- **🎨 Modern Frontend UI:** Responsive user interface styled with Tailwind CSS and Vite.

---

## 📁 Project Structure

```text
e-commerce-project/
│
├── client/         # React Frontend (Vite + Tailwind CSS)
│   ├── src/
│   └── package.json
│
├── server/         # Node.js, Express, & Mongoose Backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── utils/
│   └── package.json
│
└── .gitignore      # Global git ignore rules




🛠️ Tech Stack
Frontend:
React (Vite)

Tailwind CSS

React Router

Backend:
Node.js & Express.js

MongoDB & Mongoose

JSON Web Tokens (JWT)

Multer (for file handling)


⚙️ Getting Started & Installation
To run this project locally, follow these step-by-step instructions:

1.CLONE THE REPOSITORY
git clone (https://github.com/Masum00x/COHORT3.0ASSIGNMENT.git)
cd your-repo-name

2.SETUP THE BACKEND SERVER
cd server
npm install

2. Setup the Backend Server
Navigate to the server directory and install dependencies:

Bash
cd server
npm install
Create a .env file inside the server/ folder and add your configuration variables:

Code snippet
PORT=3000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_super_secret_jwt_key
Start the backend development server:

Bash
npm run dev
3. Setup the Frontend Client
Open a new terminal window, navigate to the client directory, and install dependencies:

Bash
cd client
npm install
Start the frontend development server:

Bash
npm run dev


🛡️ License
This project is open-source and available under the MIT License.