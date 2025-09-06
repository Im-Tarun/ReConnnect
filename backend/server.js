import express from 'express'
import cors from 'cors'
import 'dotenv/config';
import connectDB from './src/config/connectDB.js';
import { serve } from "inngest/express";
import { inngest, functions } from "./src/inngest/index.js"

const app = express();
const port = process.env.PORT || 3000

app.use(express.json())
app.use(cors())
app.use('api/inngest', serve({client: inngest, functions}))

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(port, async() => {
  await connectDB()
  console.log(`Server is running on http://localhost:${port}`);
});