import express from 'express'
import { upload } from '../config/multer.js'
import { protect } from '../middlewares/auth.js'
import { addPost, deletePost, getFeedPost, likeUnlikePost } from '../controllers/post.controller.js'

const postRouter = express.Router()

postRouter.post("/add", upload.array("images", 4), protect, addPost)
postRouter.get("/feed", protect, getFeedPost)
postRouter.post("/like-unlike", protect, likeUnlikePost)
postRouter.post("/delete", protect, deletePost)

export default postRouter