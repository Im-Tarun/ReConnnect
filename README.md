# ReConnect

ReConnect is a full-stack social media web application built with the MERN stack (MongoDB, Express.js, React, Node.js). It allows users to connect, share posts, interact with others, and build their own social network.

## Features

- **User Authentication (Clerk):** Sign up, sign in, and session management are handled with Clerk (Clerk frontend SDK in React and server-side verification on the backend).
- **Profile Management:** Edit profile details, upload profile pictures, and view other users' profiles.
- **Posts:** Create, edit, delete, and view posts with text and images.
- **Feed:** See a timeline of posts from users you follow.
- **Likes & Comments:** Like posts and add comments to interact with others.
- **Follow System:** Follow/unfollow users to curate your feed.
- **Notifications:** Get notified about new followers, likes, and comments.
- **Email sending (Nodemailer):** Transactional emails (verification, password reset, notifications) sent from the backend via Nodemailer or a provider.
- **Background jobs (Ingest / worker):** Long-running tasks (email retries, media processing, notification fan-out) are handled by background workers or a managed Ingest workflow.
- **Responsive Design:** Works well on both desktop and mobile devices.

## Getting Started

Follow these steps to run ReConnect on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (local or cloud instance)

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

4. **Set up environment variables:**
   - Copy `.env.example` to `.env` in both `backend` and `frontend` folders.
   - Fill in the required values (e.g., MongoDB URI, Clerk keys, etc.).
   - Important env vars:
     - Clerk: `CLERK_FRONTEND_API`, `CLERK_API_KEY` (and any Clerk-specific settings)
     - Email (Nodemailer / SMTP): `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `NODEMAILER_FROM`
     - Background jobs (Ingest / worker): `INGEST_API_KEY`, `INGEST_WORKER_URL` (or local worker settings)
     - Worker/queue settings (optional): `WORKER_CONCURRENCY`, `REDIS_URL` (if used)

5. **Start MongoDB:**
   - Make sure your MongoDB server is running locally or update the connection string for a remote database.

6. **Run the backend server:**
   ```bash
   cd ../backend
   npm start
   ```

6a. **Run background worker (if using local worker):**
   - If your project includes a worker script or npm task, start it alongside the backend. Example:
   ```bash
   # from backend folder
   npm run worker         # or: node worker.js
   ```
   - For hosted Ingest workers, ensure `INGEST_API_KEY` / `INGEST_WORKER_URL` are set and follow your provider's deploy docs.

7. **Run the frontend app:**
   ```bash
   cd ../frontend
   npm start
   ```

8. **Access the app:**
   - Open your browser and go to `http://localhost:3000`

## Folder Structure

```
ReConnect/
  backend/    # Express.js API and server code
  frontend/   # React.js client application
  README.md
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.

## Environment & Deployment notes

- Keep all secret keys out of VCS. Use `.env` locally, and secret managers (Vault, GitHub Secrets, Vercel/Netlify/Heroku config) in production.
- For email in production, prefer a transactional email provider (SendGrid/Mailgun/Postmark) or properly configured SMTP with rate limits.
- Monitor background jobs and add alerting for failed job rates and worker health.

