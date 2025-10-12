import fs from "fs";
import imagekit from "../config/imageKit.js";
import MessageModel from "../models/message.model.js";

const connections = {};

//controller function for server sent event endpoint
export const sseController = async (req, res) => {
  const { userId } = req.params;
  console.log("New client connected : ", userId);

  // set sse headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  //add client's res obj to connection obj
  connections[userId] = res;

  //send intial event to client
  res.write("log: Connected to sse stream\n\n");

  //handle client disconnect
  req.on("close", () => {
    delete connections[userId];
    console.log("Client disconnected");
  });
};

//send message
export const sendMessage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { to_user_id, text } = req.body;
    const image  = req.file;

    let media_url = "";
    const message_type = image ? "image" : "text";

    if (image) {
        const buffer = fs.readFileSync(image.path);
        const response = await imagekit.upload({
            file: buffer,
            fileName: image.originalname,
            folder: "posts",
        });
        media_url = imagekit.url({
            path: response.filePath,
            transformation: [
            { quality: "auto" },
            { format: "webp" },
            { width: "1280" },
            ],
        });
    }

    const newMessage = await MessageModel.create({
        from_user_id: userId,
        to_user_id,
        text,
        message_type,
        media_url
    })

    res.status(200).json({ success: true, newMessage });

    //send message using sse 
    const messageWithUserdata = await MessageModel.findById(newMessage._id).populate("from_user_id");

    if(connections[to_user_id]){
        connections[to_user_id].write(`data: ${JSON.stringify(messageWithUserdata)}\n\n`)
    }


  } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// get messages 
export const getchatMessages = async (req, res ) => {
    try {
        const {userId} = req.auth()
        const {to_user_id} = req.body

        const messages = await MessageModel.find({
            $or: [
                {from_user_id: userId, to_user_id},
                {from_user_id: to_user_id, to_user_id: userId}
            ]
        }).sort({createdAt : -1})

        //mark as seen
        await MessageModel.updateMany({from_user_id: to_user_id, to_user_id: userId}, {seen: true})

        return res.status(200).json({success: true , messages})
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
    
}


