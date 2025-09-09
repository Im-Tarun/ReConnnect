import {Inngest} from 'inngest'
import User from '../models/user.model.js'

//client to send and recieve events
export const inngest = new Inngest({id: "recconect"})


// inggest function to save userdata in db
const syncUserCreation = inngest.createFunction(
    {id:'sync-user-from-clerk'},
    {event: 'clerk/user.created'},
    async ({event})=>{
        try {
      // ensure db is connected
      await connectDB();

      const { id, first_name, last_name, email_addresses, image_url, username } = event.data;

      // check if username already exists
      let finalUsername = username;
      const existing = await User.findOne({ username });
      if (existing) {
        finalUsername = username + Math.floor(Math.random() * 1000);
      }

      // create user
      const user = await User.create({
        _id: id,  // Clerk userId
        email: email_addresses[0].email_address,
        full_name: `${first_name} ${last_name}`,
        profile_picture: image_url,
        username: finalUsername,
      });

      console.log("✅ User synced:", user);
      return { success: true, user };
    } catch (err) {
      console.error("❌ Error syncing user:", err);
      throw err;
    }
    }
)

// inggest function to update userdata in db
const syncUserUpdation = inngest.createFunction(
    {id:'update-user-from-clerk'},
    {event: 'clerk/user.updated'},

    async ({event})=>{
        const {id, first_name, last_name, email_addresses, image_url } = event.data 
        
        const updatedUserData = {
            email : email_addresses[0].email_address,
            full_name: first_name + " " + last_name,
            profile_picture: image_url,
        }
        await User.findByIdAndUpdate(id, updatedUserData)

    }
)

// inggest function to delete userdata in db
const syncUserDeletion = inngest.createFunction(
    {id:'delete-user-from-clerk'},
    {event: 'clerk/user.deleted'},

    async ({event})=>{
        const {id} = event.data 
        await User.findByIdAndDelete(id)

    }
)

// array where all the inngest functions are stored 
export const functions = [syncUserCreation, syncUserUpdation, syncUserDeletion];