import express from 'express'
import cors from 'cors'
import 'dotenv/config';
import connectDB from './src/config/connectDB.js';
import { serve } from "inngest/express";
import { inngest, functions } from "./src/inngest/index.js"
import { clerkMiddleware } from '@clerk/express'
import userRouter from './src/Routes/user.route.js';
import postRouter from './src/Routes/post.route.js';
import storyRouter from './src/Routes/story.route.js';
import messageRouter from './src/Routes/message.route.js';

const app = express();
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())
app.use('/api/inngest', serve({client: inngest, functions}))
app.use('/api/user', userRouter)
app.use('/api/post', postRouter)
app.use('/api/story', storyRouter)
app.use('/api/message', messageRouter)


app.get("/",(req, res)=>{
  res.send("hello world")
})

app.listen(port, async() => {
  await connectDB()
  console.log(`Server is running on http://localhost:${port}`);
});