import { MapPin, MessageCircle, Plus, UserPlus } from "lucide-react"; 
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const UserCard = ({ user }) => {
    const currentUser = useSelector((state)=> state.user.value)

    // const handleUnfollow = () =>{

    // }

    const handleFollow = () => {
        console.log('hii');
    }
    const handleFriendReq = () => {

    }
    
    const navigate = useNavigate()

    return (
        <div className="p-4 pt-6 flex flex-col justify-between max-w-80 shadow border border-gray-200 rounded-md bg-white space-y-2">
            <div className="flex items-center flex-col gap-2 w-full cursor-pointer3" onClick={() => navigate(`/profile/` + user._id)} >
                <img src={user?.profile_picture} alt="dp" className="size-20 rounded-full cursor-pointer" />
                <div className="flex-1 cursor-pointer" >
                    <p className="font-medium text-slate-700 ">{user?.full_name}</p>
                    <p className="text-slate-500 ">@{user?.username} </p>
                </div>
            </div>
            <p className="text-slate-600 p-2 text-center">{user?.bio}</p>

            {/* location / followers  */}
            <div className="flex justify-center gap-2 mb-4">
                <div className="flex items-center justify-center gap-1 flex-wrap border-2 text-slate-600 border-gray-300 rounded-full px-3 py-1"> 
                    <MapPin className="w-4 h-4"/>
                    <span >{user?.location} </span>
                </div>
                <div className="flex items-center justify-center gap-1 flex-wrap border-2 text-slate-600 border-gray-300  rounded-full px-3 py-1"> 
                    <span>{user?.followers.length} </span>
                    <span>Followers</span>
                </div>
            </div>

            {/* follow friend  */}
            <div className="flex  gap-2">
                <button onClick={handleFollow} disabled={currentUser?.followings.includes(user?._id)} className="flex items-center justify-center bg-slate-200 hover:bg-slate-300 flex-1 rounded-md py-3 gap-1 active:scale-95 transition cursor-pointer bg-gradient-to-l from-indigo-500 to-purple-600">
                    <UserPlus className="w-4 h-4 text-white"/>
                    <span className=" text-white">{currentUser?.followings.includes(user?._id) ? "Following" :"Follow"}</span>
                </button>

                {currentUser?.connections.includes(user?._id) ? <button onClick={handleFriendReq} className="flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded-md py-3 px-5 active:scale-95 transition cursor-pointer">
                    <Plus />
                </button> : <Link to={`/messages/${user?._id}`} className="flex items-center justify-center bg-slate-200 hover:bg-slate-300 rounded-md py-3 px-5 active:scale-95 transition cursor-pointer">
                    <MessageCircle className="text-gray-700"/>
                </Link>}
            </div>

        </div>
    );
};

export default UserCard;