import imagekit from "../config/imageKit.js"
import StoryModel from "../models/story.model.js"
import User from "../models/user.model.js"
import fs from "fs"


export const addUserStory = async (req, res) => {
    try {
        const {userId} = req.auth()
        const {content , media_type, background_color} = req.body
        const media = req.file
        let media_url = ''

        if(media_type === "image" || media_type === "video"){
            const buffer = fs.readFileSync(media.path)
            const response = await imagekit.upload({
                file: buffer,
                fileName: media.originalname,
            })            
            media_url = response.url
        }
        
        const newStory = await StoryModel.create({
            user: userId,
            media_type,
            content,
            background_color,
            media_url
        })
        
        return res.status(200).json({success: true, message: "Story uploaded sucessfully.", newStory})

    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error.message})
    }
}

export const getAllStories = async (req, res) => {
    try {
        const {userId} = req.auth()
        const user = await User.findOne(userId)

        const storyIds = [userId, ...user.connections, ...user.followings]

        const stories = await StoryModel.find({
            user: {$in: storyIds}
        }).populate("user").sort({createdAt: -1})

        return res.status(200).json({success: true, stories})

    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error.message})
    }
}