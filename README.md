# ReConnect – Social Media & Messaging Platform

ReConnect is a full-stack social media application built using the **MERN stack**, focused on real-time interaction, media sharing, and user connections.  
It supports posts, stories, friends, messaging, notifications, and background workflows using modern backend patterns.

---

## Features

- Secure authentication and account management using **Clerk**
- Create, delete, and view posts with support for **multiple images**
- Personalized feed based on followed users
- Friend request system with accept/reject workflow
- **Private messaging** enabled after mutual friendship
- Real-time messaging and in-app notifications using **Server-Sent Events (SSE)**
- Email notifications for friend requests and reminders
- Stories with text, images, and videos
- Automatic story deletion after 24 hours using **Inngest**
- Profile management (name, bio, profile picture, cover image)
- Optimized image and video uploads using **ImageKit**

---

## Tech Stack

### Frontend
- React (Vite)
- Redux Toolkit
- React Router DOM
- Tailwind CSS
- Clerk (Authentication)
- Axios
- React Hot Toast
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- Clerk Express SDK
- Inngest (Background Jobs)
- ImageKit (Media Storage)
- Nodemailer (Email Notifications)
- Multer
- Server-Sent Events (SSE)

---

## Architecture Overview

- **REST APIs** for CRUD operations (users, posts, friends, profiles)
- **SSE** for real-time messaging and notifications
- **Inngest** for delayed and background tasks
- **ImageKit** for efficient media upload and delivery
- **MongoDB** for scalable data storage

---

## Authentication & Security

- Authentication handled by Clerk
- Protected backend routes using Clerk middleware
- Secure user data synchronization with MongoDB
- Environment-based configuration using dotenv

---

## Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB
- Clerk account
- ImageKit account
- Inngest account

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/ReConnect.git
   cd ReConnect
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

- Create .env files in frontend and backend directories and configure:
- Clerk API keys
- MongoDB connection URI
- ImageKit credentials
- Email service credentials
- Inngest keys

### Future Improvements

- Read receipts and typing indicators
- Push notifications
- Search functionality
- Group chats
- Performance optimization for large feeds

### License

- This project is for learning and portfolio purposes.

### Author

- Tarun Yaduwanshi
- Full-Stack Web Developer
- GitHub: https://github.com/Im-Tarun
