import express from 'express'
import cors from 'cors'
import 'dotenv/config';
import connectDB from './src/config/connectDB.js';
import { serve } from "inngest/express";
import { inngest, functions } from "./src/inngest/index.js"
import { clerkMiddleware } from '@clerk/express'
import userRouter from './src/Routes/user.route.js';
import path from 'path'

const app = express();
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())
app.use('/api/inngest', serve({client: inngest, functions}))
app.use('/api/user', userRouter)


const __dirname = path.resolve();
const frontendPath = path.join(__dirname, "..", "frontend", "dist");

app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(port, async() => {
  await connectDB()
  console.log(`Server is running on http://localhost:${port}`);
});