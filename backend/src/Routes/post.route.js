import express from 'express'
import { upload } from '../config/multer.js'
import { protect } from '../middlewares/auth.js'
import { addPost, getFeedPost, likeUnlikePost } from '../controllers/post.controller.js'

const postRouter = express.Router()

postRouter.post("/add",protect, upload.array("images", 4), addPost)
postRouter.get("/feed", protect, getFeedPost)
postRouter.post("/like-unlike", protect, likeUnlikePost)

export default postRouter