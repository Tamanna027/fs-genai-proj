# Full Stack Generative AI Interview Platform

A full-stack web application that provides an AI-powered interview experience. The platform combines a React-based frontend with a Node.js/Express backend and an AI service to support interview-related functionality.

## 🚀 Features

- User registration and login
- Authentication and protected routes
- AI-powered interview functionality
- Interview report generation and management
- User-specific interview data
- Backend API architecture with controllers, routes, models, and services
- Secure authentication middleware
- Blacklist handling for authentication
- Responsive and interactive frontend
- Modular feature-based frontend architecture

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript (JSX)
- SCSS / CSS
- React Router
- Context API
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT-based authentication
- REST APIs
- AI service integration

### Development Tools

- Git
- GitHub
- npm
- Vite

## 📁 Project Structure

```text
fs-genai-proj/
│
├── BACKEND/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   └── interview.controller.js
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middlewares.js
│   │   │   └── file.middlewares.js
│   │   │
│   │   ├── models/
│   │   │   ├── blacklist.model.js
│   │   │   ├── interviewReport.model.js
│   │   │   └── user.model.js
│   │   │
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   └── interview.routes.js
│   │   │
│   │   ├── services/
│   │   │   └── ai.service.js
│   │   │
│   │   └── app.js
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── FRONTEND/
│   ├── public/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── pages/
│   │   │   │   └── services/
│   │   │   │
│   │   │   └── interview/
│   │   │       ├── hooks/
│   │   │       ├── pages/
│   │   │       ├── services/
│   │   │       └── styles/
│   │   │
│   │   ├── App.jsx
│   │   ├── app.routes.jsx
│   │   ├── main.jsx
│   │   └── styles
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── index.html
│
├── .gitignore
└── README.md