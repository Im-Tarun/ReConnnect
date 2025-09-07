import {Inngest} from 'inngest'
import User from '../models/user.model.js'

//client to send and recieve events
export const inngest = new Inngest({id: "recconect"})


// inggest function to save userdata in db
const syncUserCreation = inngest.createFunction(
    {id:'sync-user-from-clerk'},
    {event: 'clerk/user.created'},
    async ({event})=>{
        const {id, first_name, last_name, email_addresses, image_url } = event.data 
        let username = email_addresses[0].email_address.split("@")[0]


        const user = await User.findOne({username})

        if(user){
            username = username + Math.floor(Math.random() * 1000)
        }

        const newUser = new User({
            _id: id,
            email : email_addresses[0].email_address,
            full_name: first_name + " " + last_name,
            profile_picture: image_url,
            username,
        })
        newUser.save()
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