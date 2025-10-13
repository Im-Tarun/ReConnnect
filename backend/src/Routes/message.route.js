import express from 'express'
import { upload } from '../config/multer.js'
import { protect } from '../middlewares/auth.js'
import { getchatMessages, getRecentMessages, sendMessage, sseController } from '../controllers/message.controller.js'

const messageRouter = express.Router()

messageRouter.post("/send", upload.single("image"), protect, sendMessage)
messageRouter.post("/get", protect, getchatMessages)
messageRouter.get("/recent", protect, getRecentMessages)
messageRouter.get("/:userId", sseController)


export default messageRouter