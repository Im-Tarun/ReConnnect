import { MapPin, MessageCircle, Plus, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axios.js";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import { fetchConnections } from "../features/connections/connectionsSlice";
import { fetchUser } from "../features/user/userSlice";


const UserCard = ({ user }) => {
    const navigate = useNavigate()
    const currentUser = useSelector((state) => state.user.value)
    const dispatch = useDispatch()
    const {getToken} = useAuth()

    const handleFollow = async (userId) => {
        try {
            const { data } = await api.post('/api/user/follow', { id: userId }, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                toast.success(data.message)
                getToken().then((token) => {
                    dispatch(fetchUser(token))
                })
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Something went wrong.")
        }
    }

    const handleFriendReq = async (userId) => {
        try {
            const { data } = await api.post('/api/user/connect', { id: userId }, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })
            if (data.success) {
                toast.success(data.message)
                getToken().then((token) => {
                    dispatch(fetchConnections(token))
                })
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || "Something went wrong.")
        }
    }
    

    return (
        <div className="p-4 pt-6 w-full flex flex-col justify-between max-w-80 shadow border border-gray-200 rounded-md bg-white">
            <div className="flex items-center flex-col gap-2 w-full cursor-pointer" onClick={() => navigate(`/profile/${user?._id}`)} >
                <img src={user?.profile_picture} alt="dp" className="size-20 rounded-full cursor-pointer object-cover" />
                <div className="flex-1 cursor-pointer flex items-center flex-col" >
                    <p className="font-medium text-slate-700 ">{user?.full_name}</p>
                    <p className="text-slate-500 ">@{user?.username} </p>
                </div>
            </div>
            <p className="text-slate-600 p-2 pt-1 text-center">{user?.bio}</p>

            {/* location / followers  */}
            <div className="flex justify-center gap-2 mb-4 flex-wrap">
                <div className="flex items-center justify-center gap-1 border-2 text-slate-600 border-gray-300 rounded-full px-3 py-1">
                    <MapPin className="w-4 h-4" />
                    <span >{user?.location} </span>
                </div>
                <div className="flex items-center justify-center gap-1 border-2 text-slate-600 border-gray-300  rounded-full px-3 py-1">
                    <span>{user?.followers.length} </span>
                    <span>Followers</span>
                </div>
            </div>

            {/* follow friend  */}
            <div className="flex  gap-2">
                <button onClick={()=>handleFollow(user?._id)} disabled={currentUser?.followings.includes(user?._id)} className={`flex items-center justify-center bg-slate-200 hover:bg-slate-300 flex-1 rounded-md py-3 active:scale-95 transition cursor-pointer ${currentUser?.followings.includes(user?._id) ? "text-black" : "bg-gradient-to-l from-indigo-500 to-purple-600 text-white "}`}>
                    <UserPlus className="w-4 h-4  " />
                    <span className="px-2" >{currentUser?.followings.includes(user?._id) ? "Following" : "Follow"}</span>
                </button>

                <button onClick={()=>{
                    currentUser?.connections.includes(user?._id) ? navigate(`/messages/${user?._id}`) :  handleFriendReq(user?._id)
                }
                    } className="flex flex-1 items-center justify-center bg-slate-200 hover:bg-slate-300 rounded-md py-3 px-5 active:scale-95 transition cursor-pointer bg-gradient-to-l from-indigo-500 to-purple-600 text-white">
                    { currentUser?.connections.includes(user?._id) ? <>
                    <MessageCircle className="w-4 h-4 text-white"/>
                    <span className="px-2">Message</span>
                    </> : <>
                    <Plus className="w-4 h-4 text-white" /> 
                    <span className="px-1">Friend</span>
                    </>}
                </button> 
            </div>
        </div>
    );
};

export default UserCard;