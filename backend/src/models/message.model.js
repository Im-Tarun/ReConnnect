import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    from_user_id: {
        type: String,
        ref:'User',
        required: true
    },
    to_user_id: {
        type: String,
        ref:'User',
        required: true
    },
    text:{
        type: String,
        trim: true
    },
    media_url:{
        type: String
    },
    message_type: {
        type: String,
        enum:["text","image"],
        required: true,
    },
    seen:{
        type: Boolean,
        default: false
    }
},{timestamps: true, minimize: false});

const MessageModel = mongoose.model("Message", messageSchema)

export default MessageModel;