import express from 'express'
import { acceptConnection, discoverUser, followUser, getAllConnections, getRecentMessages, getUserData, getUserProfile, sendConnection, unfollowUser, updateUserData } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.js';
import { upload } from '../config/multer.js';

const userRouter = express.Router();

userRouter.get('/data', protect, getUserData)
userRouter.post('/update', protect, upload.fields([{name: "profile", maxCount:1},{name: "cover", maxCount:1}]), updateUserData)
userRouter.get('/discover', protect,  discoverUser)
userRouter.post('/follow', protect,  followUser)
userRouter.post('/unfollow', protect,  unfollowUser)
userRouter.post('/connect', protect,  sendConnection)
userRouter.post('/accept', protect,  acceptConnection)
userRouter.get('/connections', protect,  getAllConnections)
userRouter.post('/profile', protect,  getUserProfile) 
userRouter.get("/recentMessages", protect, getRecentMessages)


export default userRouter