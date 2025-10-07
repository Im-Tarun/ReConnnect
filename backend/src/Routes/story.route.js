import express from 'express'
import { upload } from '../config/multer.js'
import { protect } from '../middlewares/auth.js'
import { addUserStory, getAllStories } from '../controllers/story.controller.js'

const storyRouter = express.Router()

storyRouter.post("/add", upload.single("media"), protect, addUserStory)
storyRouter.get("/getAll", protect, getAllStories)

export default storyRouter