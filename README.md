<div align="center">
  <h1>🎵 Full Stack MERN Music Player</h1>
  <p>A highly interactive and scalable music streaming web application built with the MERN stack.</p>

  ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
  ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
  ![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)
</div>

## 📖 Overview
This project is a fully functional music player web application designed to demonstrate clean code architecture, scalable design, and seamless user experience. It leverages modern web technologies to deliver interactive features and robust API integrations.

### ✨ Key Features
- **Scalable Architecture:** Designed using industry-standard MVC architecture on the backend.
- **RESTful APIs:** Secure and well-documented Express.js endpoints.
- **State Management:** Complex frontend state managed elegantly with Redux Toolkit and React Hooks.
- **Authentication:** Secure JWT-based user authentication and authorization.
- **Responsive UI:** Clean, intuitive, and highly interactive user interface designed with TailwindCSS.
- **Containerization:** Ready for scalable deployment using Docker.

## 🚀 Tech Stack
- **Frontend:** React.js, Vite, Redux Toolkit, TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Deployment & Ops:** Docker, Vercel, Render

## ⚙️ Local Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd fullstack-music-player
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Add your MongoDB URI and secrets to .env
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

### 🐳 Run with Docker
You can easily spin up the entire application stack using Docker:
```bash
docker-compose up --build
```

## 🏗️ Deployment
This project is pre-configured for modern PaaS deployment:
- **Backend (`render.yaml`):** Deployable with a single click to [Render](https://render.com/).
- **Frontend (`vercel.json`):** Configured for seamless deployment and client-side routing on [Vercel](https://vercel.com/).

## 👨‍💻 Developer Information
This project was developed with a strong emphasis on clean code, maintainable architecture, and robust problem-solving—key principles essential for any Full Stack Developer role.
