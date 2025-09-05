import mongoose from "mongoose";
const uri = process.env.MONGO_URI

const connectDB = async () => {
  try {
    await mongoose.connect(uri)
    
    console.log("Database connected successfully ")
  } catch (error) {
    console.log("db not connected",error)
    process.exit(1)
  }
}

export default connectDB