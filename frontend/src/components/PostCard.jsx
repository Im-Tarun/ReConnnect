import { useAuth } from "@clerk/clerk-react";
import { BadgeCheck, Dot, Heart, MessageCircle, Share2, SquareX } from "lucide-react";
import moment from "moment";
import { useState } from "react"; 
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import toast from "react-hot-toast";


const PostCard = ({ post, showDelete, handleDeletePost ,profileId }) => {

    const [showConfirmDelete, setshowConfirmDelete] = useState(false)
    const [likes, setLikes] = useState(post.likes_count)
    const currentUser = useSelector((state)=> state.user.value);
    const hastagContent = post.content?.split(/(#\w+)/g);
    const {getToken} = useAuth()

    const handleLike = async()=>{
        try {
            const {data} = await api.post("/api/post/like-unlike",{postId : post?._id},{
                headers: {Authorization: `Bearer ${await getToken()}`}
            })
            if(data.success){
                toast.success(data.message)
                setLikes(prevItems=> prevItems.includes(currentUser._id) ? prevItems.filter(elem => elem !== currentUser._id ) : [...prevItems, currentUser._id])
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    
    const navigate = useNavigate()

    return (
        <div className="bg-white rounded-xl shadow p-4 w-full max-w-2xl space-y-4  relative">
            {/* userinfo */}
            <div className="inline-flex items-center gap-3 cursor-pointer" onClick={()=>navigate("/profile/"+post.user?._id)}>
                <img src={post.user?.profile_picture} alt="dp" className="h-10 w-10 rounded-full object-cover" />
                <div>
                    <div className="text-black flex items-center gap-1.5">
                        <span>{post.user?.full_name}</span>
                        <BadgeCheck className='w-4 h-4 text-blue-600' />
                    </div>
                    <div className="text-gray-500 text-sm inline-flex items-center">@{post.user?.username} <Dot /> {moment(post.createdAt).fromNow()} </div>
                </div>
            </div>
            {showDelete && !profileId && <button className="absolute top-4 right-4" onClick={()=>setshowConfirmDelete(true)}>
                <SquareX className="size-8 hover:text-[#e2002d] hover:scale-105 text-gray-600 cursor-pointer"/>
            </button>}
            {showConfirmDelete && <div className=" absolute inset-0  rounded-xl mb-0 bg-black/45 flex items-center justify-center gap-4 ">
                <button className="px-6 py-2  rounded-md bg-amber-100 active:scale-95 " onClick={()=>setshowConfirmDelete(false)}>Cancel</button>
                <button className="px-6 py-2 text-white rounded-md  active:scale-95 bg-indigo-700" onClick={()=>{
                    handleDeletePost(post._id)
                    setshowConfirmDelete(false)
                }}>Delete</button>
            </div>}

            {/* post content  */}
            {post.content && <p className="text-gray-800 ">
                {hastagContent.map((word, id) => {
                    return word.startsWith("#") ? (<span key={id} className="text-blue-800 "> {word} </span>) : (word)
                })}
            </p>}
            <div className="grid grid-cols-2 gap-2">
                {post.image_urls.map((url, ind) => (
                    <div key={ind} className={`w-full max-h-96 border-2 border-gray-200 flex justify-center h-56 overflow-hidden rounded-lg ${post.image_urls.length === 1 && 'col-span-2 h-auto'}`}>
                        <img src={url} alt="image" className=" object-cover h-full hover:scale-103 transition-all duration-500" />
                    </div>
                ))}
            </div>

            {/* likes comments */}
            <div className="border-t-2 w-full pt-3 border-gray-300 text-gray-600 space-x-4 inline-flex">
                <div className={`flex items-center gap-1 ${likes.includes(currentUser?._id) && "text-red-600 fill-red-600"}`}
                onClick={handleLike}>
                    <Heart className={`size-5 cursor-pointer ${likes.includes(currentUser?._id) && "text-red-600 fill-red-600"}`}/>
                    <span>{likes.length}</span>
                </div>
                <div className="flex items-center gap-1">
                    <MessageCircle className="size-5 cursor-pointer"/>
                    <span>8</span>
                </div>
                <div className="flex items-center gap-1">
                    <Share2 className="size-5 cursor-pointer"/>
                    <span>2</span>
                </div>

            </div>

        </div>
    );
};

export default PostCard;