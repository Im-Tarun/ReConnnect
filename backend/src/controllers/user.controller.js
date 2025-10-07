import imagekit from "../config/imageKit.js";
import { inngest } from "../inngest/index.js";
import ConnectionModel from "../models/connection.model.js";
import MessageModel from "../models/message.model.js";
import PostModel from "../models/post.model.js";
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
        let {username, bio, location, full_name} = req.body;
        const tempUser = await User.findById(userId);
        
        !username && (username = tempUser.username)

        if(tempUser.username !== username ){
            const user = await User.findOne({username})
            if(user){
                username = tempUser.username
            }
        }
        console.log(full_name)
        const updatedUser = {
            full_name,
            username,
            bio,
            location,
        }

        const profile = req.files.profile && req.files.profile[0]
        const cover = req.files.cover && req.files.cover[0]

        if(profile){
            const buffer = fs.readFileSync(profile.path)
            const response = await imagekit.upload({
                file: buffer,
                fileName: profile.originalname
            })
            const url = imagekit.url({
                path: response.filePath,
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

export const sendConnection = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {id} = req.body;

        //check if user has not sent 20 req in a day
        const last24hours = new Date(Date.now() - 24*60*60*1000) 
        const connectionReq = await ConnectionModel.find({from_user_id: userId, createdAt: {$gt: last24hours}})
        if(connectionReq.length >= 20){
            return res.status(300).json({success: false, message: "Can't send more than 20 connection request in 24 hours"})
        }

        //check if there is already a connection model 
        const connection = await ConnectionModel.findOne({
            $or:[
                {from_user_id: userId, to_user_id: id},
                {from_user_id: id, to_user_id: userId},
            ]
        })

        if(!connection){
            const newConnection = await ConnectionModel.create({
                from_user_id: userId,
                to_user_id: id
            })

            //send email remainder for new connection and if not accepted email remainder again after 24 hour 
            await inngest.send({
                name: "app/connection-request",
                data: {connectionId: newConnection._id}
            })

            return res.status(200).json({success: true, message: "Connection Req Sent Successfully"})
        }else if(connection && connection.status === "pending"){
            return res.status(400).json({success: false, message: "Connection Req is Pending "})
        }

        return res.status(400).json({success: false, message: "Already connected with this User "})

    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error.message})
    }
}

export const acceptConnection = async (req, res) => {
    try {
        const {userId} = req.auth();
        const {id} = req.body;

        const connection = await ConnectionModel.findOne({from_user_id: id, to_user_id: userId})

        if(!connection){
            return res.status(400).json({success: false, message: "Connection not found"})
        }

        const fromUser = await User.findById(userId)
        fromUser.connections.push(id)
        await fromUser.save()

        const toUser = await User.findById(id)
        toUser.connections.push(userId)
        await toUser.save()

        connection.status = "accepted"
        await connection.save()

        return res.status(200).json({success: true, message: "Connection accepted successfully"})

    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error.message})
    }
    
}

export const getAllConnections = async (req, res) => {
    try {
        const {userId} = req.auth()
        const user = await User.findById(userId).populate('connections followers followings')

        const connections = user.connections
        const followers = user.followers
        const followings = user.followings
        
        const pendingConnections = (await ConnectionModel.find({to_user_id: userId}).populate("from_user_id")).map(req=>{
            if(req.status === "pending") return req.from_user_id;
        })

        return res.status(200).json({success: true, connections, followers, followings, pendingConnections })

    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error.message})
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const {profileId } = req.body
        const profile = await User.findById(profileId)
        if(!profile){
            return res.status(404).json({success: false, message: "Profile not found."})
        }
        const posts = await PostModel.find({user: profileId}).populate("user").sort({createdAt: -1})

        return res.status(200).json({success: true, profile, posts})

    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error.message})
    }
}
 
export const getRecentMessages = async (req, res ) => {
    try {
        const {userId} = req.auth()

        const messages = await MessageModel.find({to_user_id: userId}).populate("to_user_id from_user_id").sort({createdAt : -1})

        return res.status(200).json({success: true , messages})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
    
}