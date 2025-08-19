import { useState } from "react";
import { dummyUserData } from "../assets/assets";
import {  Pencil } from "lucide-react";


const EditProfile = ({setShowEdit}) => {
    const user = dummyUserData;

    const [profile, setProfile] = useState({
        full_name: user.full_name,
        username: user.username,
        bio: user.bio,
        profile_picture: user.profile_picture,
        cover_photo: user.cover_photo,
        location: user.location
    })

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        setShowEdit(false)
    }

    return (
        <div className="fixed inset-0 z-110 min-h-screen overflow-y-scroll no-scrollbar p-2 sm:p-6 bg-black/80 backdrop-blur ">
            <div className=" max-w-2xl mx-auto  bg-white rounded-lg p-4 sm:p-6" >
                <h1 className="text-2xl font-bold text-slate-900 mb-4">Edit Profile</h1>
                <form className="space-y-6" onSubmit={handleUpdateProfile}>

                    {/* profile pic  */}
                    <div className="w-fit">
                        <label htmlFor="dp" className=" block text-sm font-semibold  text-slate-700 cursor-pointer">
                            Profile Picture
                            <input type="file" accept="image/*" id="dp" hidden
                                onChange={(e) => setProfile({ ...profile, profile_picture: URL.createObjectURL(e.target.files[0]) })} />
                            <div className="group relative w-fit">
                                <img src={profile.profile_picture} alt="add" className="h-24 w-24 object-cover mt-1 rounded-full" />
                                <div className=" absolute hidden group-hover:flex items-center justify-center bg-black/30 inset-0 rounded-full ">
                                    <Pencil className="size-6 text-white" />
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* cover photo  */}
                    <div className="w-fit">
                        <label htmlFor="cover_pic" className="block text-sm font-semibold  text-slate-700 cursor-pointer">
                            Cover Photo
                            <input type="file" accept="image/*" id="cover_pic" hidden
                                onChange={(e) => setProfile({ ...profile, cover_photo: URL.createObjectURL(e.target.files[0]) })} />
                            <div className="group relative w-fit">
                                <img src={profile.cover_photo} alt="add" className="w-80 h-40 object-cover mt-1  rounded" />
                                <div className=" absolute hidden group-hover:flex items-center justify-center bg-black/30 inset-0 rounded ">
                                    <Pencil className="size-6 text-white" />
                                </div>
                            </div>
                        </label>
                    </div>

                    {/* fullname */}
                    <div className="font-medium  mb-6 cursor-pointer flex flex-col">
                        <label htmlFor="fullName" className="block text-sm font-semibold  text-slate-700">Name</label>
                        <input type="text" id="fullName" placeholder="Enter your full Name" value={profile.full_name}
                            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} className="w-full p-3 mt-1 border-2 border-gray-300 rounded-lg" />
                    </div>
                    
                    {/* username  */}
                    <div className=" mb-6 cursor-pointer flex flex-col">
                        <label htmlFor="username" className="block  text-slate-700 text-sm font-semibold ">Username</label>
                        <input type="text" id="username" placeholder="Enter your username" value={profile.username}
                            onChange={(e) => setProfile({ ...profile, username: e.target.value })} className="w-full p-3 mt-1 border-2 border-gray-300 rounded-lg" />
                    </div>

                    {/* bio  */}
                    <div className=" mb-6 cursor-pointer flex flex-col">
                        <label htmlFor="bio" className="block  text-slate-700 text-sm font-semibold ">Bio</label>
                        <textarea rows={3}  type="text" id="bio" placeholder="bio" value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="w-full p-3 mt-1 border-2 border-gray-300 rounded-lg resize-none " />
                    </div>

                    {/* location */}
                    <div className=" mb-6 cursor-pointer flex flex-col">
                        <label htmlFor="location" className="block  text-slate-700 text-sm font-semibold ">Location</label>
                        <input type="text" id="location" placeholder="Enter your username" value={profile.location}
                            onChange={(e) => setProfile({ ...profile, location: e.target.value })} className="w-full p-3 mt-1 border-2 border-gray-300 rounded-lg" />
                    </div>

                    {/* buttons  */}
                    <div className="flex justify-end">
                        <button onClick={()=> setShowEdit(false)} className="py-1.5 px-4 rounded-lg bg-slate-50  text-slate-700 border-2 border-slate-300 active:scale-95 transition-all cursor-pointer">Cancel</button>
                        <button type="submit" className="py-1.5 px-4 ml-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white active:scale-95 transition-all cursor-pointer">Save Changes</button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default EditProfile;