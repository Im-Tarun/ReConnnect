import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    _id: { 
        type: String, 
        required: true 
    },
    email: {
        type: String ,
        required:true
    },
    full_name: {
        type: String ,
        required:true
    },
    username: {
        type: String ,
        unique:true
    },
    bio: {
        type: String ,
        default: "I am using reconnect."
    
    },
    profile_picture: {
        type: String ,
        default: ''
  
    },
    cover_photo: {
        type: String ,
        default: ''
    },
    location: {
        type: String ,
        default: ''
    },
    followers: [{
        type: String ,
        ref:'User'
    }],
    followings: [{
        type: String ,
        ref:'User'

    }],
    connections: [{
        type: String ,
        ref:'User'
    }],
},{timestamps:true, minimize:false, _id: false,});


// /** @type {import('mongoose').Model} **/
const User = new mongoose.model("User", userSchema)

export default User