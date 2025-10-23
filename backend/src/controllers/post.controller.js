import fs from "fs"
import imagekit from "../config/imageKit.js";
import PostModel from "../models/post.model.js";
import User from "../models/user.model.js";

//add new post 
export const addPost = async (req, res) => {
    try {
        const {userId} = req.auth();
        const { content, post_type } = req.body;
        const images = req.files;

        let image_urls = []

        if(images.length){
            image_urls = await Promise.all(
                images.map(async (img)=>{
                    const buffer = fs.readFileSync(img.path)
                    const response = await imagekit.upload({
                        file: buffer,
                        fileName: img.originalname,
                        folder:"posts"
                    })
                    const url = imagekit.url({
                        path: response.filePath,
                        transformation:[
                            {quality: 'auto'},
                            {format: 'webp'},
                            {width : '1280'}
                        ]
                    })
                    
                    return url
                })
            )
        }

        const newPost = await PostModel.create({
            user: userId,
            image_urls,
            post_type,
            content,
        });

        return res.status(200).json({success: true, message: "Post created Successfully.", newPost})

    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error.message})
    }
}

// get all posts
export const getFeedPost = async (req, res) => {
    try {
        const {userId} = req.auth();
        const user = await User.findById(userId);
        
        const allUserIds = [userId, ...user.followings, ...user.connections]
        const allPost = await PostModel.find({user: {$in: allUserIds}}).populate('user').sort({createdAt: -1})
        
        return res.status(200).json({success: true, allPost})

    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error.message})
    }
}

// like and unlike post 
export const likeUnlikePost = async ( req, res)=>{
    try {
        const {userId} = req.auth()
        const {postId} = req.body
        
        const post = await PostModel.findById(postId)

        if(post.likes_count.includes(userId)){
            post.likes_count = post.likes_count.filter(id => id != userId );
            await post.save();

            return res.status(200).json({success: true, message:"Post Unliked"});
        }
        post.likes_count.push(userId );
        await post.save();

        return res.status(200).json({success: true, message:"Post Liked"});

    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error.message})
    }
}

// delete post
export const deletePost = async (req, res) => {
    try {
        const {userId} = req.auth()
        const {postId} = req.body;

        const post = await PostModel.findById(postId)
        if(!post) return res.status(404).json({success: false, message: "Post not found."})
        if(post.user.toString() !== userId.toString()) return res.status(400).json({success: false, message: "Not your Post"})
        
        await post.deleteOne()
        return res.status(200).json({success: true, message: "Post deleted successfully"})

    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: error.message})
    }
}