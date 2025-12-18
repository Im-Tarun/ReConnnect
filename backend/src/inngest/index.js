import { Inngest } from "inngest";
import User from "../models/user.model.js";
import connectDB from "../config/connectDB.js";
import sendEmail from "../config/nodeMailer.js";
import ConnectionModel from "../models/connection.model.js";
import StoryModel from "../models/story.model.js";

//client to send and recieve events
export const inngest = new Inngest({ id: "recconect" });

// inggest function to save userdata in db
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      await connectDB();
      const {
        id,
        first_name,
        last_name,
        email_addresses,
        image_url,
        username,
      } = event.data;

      // check if username already exists
      let finalUsername = username;
      let existing = await User.findOne({ username });
      while (existing) {
        finalUsername = username + Math.floor(Math.random() * 1000);
        existing = await User.findOne({ finalUsername });
      }

      // create user
      const user = await User.create({
        _id: id, // Clerk userId
        email: email_addresses[0].email_address,
        full_name: `${first_name} ${last_name}`,
        profile_picture: image_url,
        username: finalUsername,
      });

      //follow me
      const userId = process.env.ADMIN_USER_ID;

      await User.findByIdAndUpdate(id, { $addToSet: { followings: userId } });

      await User.findByIdAndUpdate(userId, { $addToSet: { followers: id } });

      return { success: true, user };
    } catch (err) {
      console.error(" Error syncing user:", err);
      throw err;
    }
  }
);

// inggest function to update userdata in db
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },

  async ({ event }) => {
    connectDB();
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    const updatedUserData = {
      email: email_addresses[0].email_address,
      full_name: first_name + " " + last_name,
      profile_picture: image_url,
    };
    await User.findByIdAndUpdate(id, updatedUserData);
    return { message: "User Updated in Database" };
  }
);

// inggest function to delete userdata in db
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },

  async ({ event }) => {
    connectDB();
    const { id } = event.data;
    await User.findByIdAndDelete(id);
    return { message: "User Deleted in Database" };
  }
);

//inngest function to send reminder when new connection request added
const connectionReminder = inngest.createFunction(
  { id: "send-new-connection-reminder" },
  { event: "app/connection-request" },
  async ({ event, step }) => {
    const { connectionId } = event.data;

    await step.run("send-connection-req-mail", async () => {
      const connection = await ConnectionModel.findById(connectionId).populate(
        "from_user_id to_user_id"
      );
      const subject = "New connection request";
      const body = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hi ${connection.to_user_id.full_name}, </h2>
        <p>You have a new connection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username}</p>
        <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color:
        #10b981;">here</a> to accept or reject the request</p>
        <br/>
        <p>Thanks, <br/>PingUp - Stay Connected</p>
      </div>`;

      await sendEmail({ to: connection.to_user_id.email, subject, body });
    });

    const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await step.sleepUntil("wait-24-hours", in24Hours);

    await step.run("send-connection-req-mail", async () => {
      const connection = await ConnectionModel.findById(connectionId).populate(
        "from_user_id to_user_id"
      );

      if (connection.status === "accepted")
        return { message: "Already accepted" };

      const subject = "New connection request";
      const body = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Hi ${connection.to_user_id.full_name}, </h2>
        <p>You have a new connection request from ${connection.from_user_id.full_name} - @${connection.from_user_id.username}</p>
        <p>Click <a href="${process.env.FRONTEND_URL}/connections" style="color:
        #10b981;">here</a> to accept or reject the request</p>
        <br/>
        <p>Thanks, <br/>PingUp - Stay Connected</p>
      </div>`;

      await sendEmail({ to: connection.to_user_id.email, subject, body });

      return { message: "Reminder sent" };
    });
  }
);

//ingest function to delete stroy from db after 24 hours
export const deleteStory24Hour = inngest.createFunction(
  { id: "delete-story" },
  { event: "app/story-delete" },
  async ({ event, step }) => {
    const { storyId } = event.data;
    // const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const in24Hours = new Date(Date.now() + 60 * 1000);

    // Wait 24 hours
    await step.sleepUntil("wait-24-hours", in24Hours);

    // Safely delete story
    return await step.run("delete-story", async () => {
      const story = await StoryModel.findById(storyId);
      if (!story) {
        return { message: "Story already deleted or not found." };
      }

      await StoryModel.findByIdAndDelete(storyId);
      return { message: `Story ${storyId} deleted after 24 hours.` };
    });
  }
);

// array where all the inngest functions are stored
export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion,
  connectionReminder,
  deleteStory24Hour,
];
