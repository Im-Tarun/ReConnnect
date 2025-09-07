import imagekit from "../config/imageKit.js";
import User from "../models/user.model.js"
import fs from "fs"

export const getUserData = async (req, res) => {
    try {
        const {userId} = req.auth();
        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({success: false, message: "User Not Found"})
        }
        return res.status(200).json({success: true, user})

    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error.message})
    }
}

export const updateUserData = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {username, bio, location, full_name} = req.body;
        const tempUser = await User.findById(userId);
        
        !username && (username = tempUser.username)

        if(tempUser.username !== username ){
            const user = await User.findOne({username})
            if(user){
                username = tempUser.username
            }
        }

        const updatedUser = {
            username,
            bio,
            location,
            full_name
        }

        const profile = req.files.profile && req.files.profile[0]
        const cover = req.files.cover && req.files.cover[0]

        if(profile){
            const buffer = fs.readFileSync(profile.path)
            const respose = await imagekit.upload({
                file: buffer,
                fileName: profile.originalname
            })
            const url = imagekit.url({
                path: respose.filePath,
                transformation:[
                    {quality: 'auto'},
                    {format: 'webp'},
                    {width : '512'}
                ]
            })
            updatedUser.profile_picture = url;
        }
        
        if(cover){
            const buffer = fs.readFileSync(cover.path)
            const respose = await imagekit.upload({
                file: buffer,
                fileName: cover.originalname
            })
            const url = imagekit.url({
                path: respose.filePath,
                transformation:[
                    {quality: 'auto'},
                    {format: 'webp'},
                    {width : '1280'}
                ]
            })
            updatedUser.cover_photo = url;
        }

        const user = await User.findByIdAndUpdate(userId, updatedUser, {new:true})
        res.status(200).json({success: true, user})

    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error.message})
    }
}

export const discoverUser = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {input} = req.body;

        const allUsers = await User.find({
            $or: [
                {username : new RegExp(input, 'i')},
                {full_name : new RegExp(input, 'i')},
                {email : new RegExp(input, 'i')},
                {location : new RegExp(input, 'i')}
            ]
        })

        const filterUsers = allUsers.filter(user=> user._id !== userId)

        
        return res.status(200).json({success: true, users: filterUsers})

    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error.message})
    }
}

export const followUser = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {id} = req.body;

        const user = await User.findById(userId)

        if(user.followings.includes(id)){
            return res.status(400).json({success: false, message:"Already following user"})
        }

        user.followings.push(id)
        await user.save()

        const toUser = await User.findById(id)
        toUser.followers.push(userId)
        await toUser.save()
        
        return res.status(200).json({success: true, message: "Now you are following this user"})

    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error.message})
    }
}

export const unfollowUser = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {id} = req.body;

        const user = await User.findById(userId)

        if(!user.followings.includes(id)){
            return res.status(404).json({success: false, message:"User not found"})
        }

        user.followings = user.followings.filter(following => following !== id)
        await user.save()

        const toUser = await User.findById(id)
        toUser.followers = toUser.followers.filter(follower => follower !== userId)
        await toUser.save()
        
        return res.status(200).json({success: true, message: "You are no longer following this user"})

    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error.message})
    }
}