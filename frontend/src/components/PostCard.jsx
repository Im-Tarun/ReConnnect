import { BadgeCheck, Dot, Heart, MessageCircle, Share2 } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { dummyUserData } from "../assets/assets";
import { useNavigate } from "react-router-dom";


const PostCard = ({ post }) => {

    const hastagContent = post.content?.split(/(#\w+)/g);

    const [likes, setLikes] = useState(post.likes_count)
    const currentUser = dummyUserData;
    

    const handleLike = ()=>{
        setLikes(prevItems=> prevItems.includes(currentUser._id) ? prevItems.filter(elem => elem !== currentUser._id ) : [...prevItems, currentUser._id])

        // update like to db 
    }

    const navigate = useNavigate()

    return (
        <div className="bg-white rounded-xl shadow p-4 w-full max-w-2xl space-y-4">
            {/* userinfo */}
            <div className="inline-flex items-center gap-3 cursor-pointer" onClick={()=>navigate("/profile/"+post.user?._id)}>
                <img src={post.user?.profile_picture} alt="dp" className="h-10 w-10 rounded-full " />
                <div>
                    <div className="text-black flex items-center gap-1.5">
                        <span>{post.user?.full_name}</span>
                        <BadgeCheck className='w-4 h-4 text-blue-600' />
                    </div>
                    <div className="text-gray-500 text-sm inline-flex items-center">@{post.user?.username} <Dot /> {moment(post.createdAt).fromNow()} </div>
                </div>
            </div>

            {/* post content  */}
            {post.content && <p className="text-gray-800 text-sm">
                {hastagContent.map((word, id) => {
                    return word.startsWith("#") ? (<span key={id} className="text-blue-800"> {word} </span>) : (word)
                })}
            </p>}
            <div className="grid grid-cols-2 gap-2">
                {post.image_urls.map((url, ind) => (
                    <div key={ind} className={`w-full h-56 overflow-hidden rounded-lg ${post.image_urls.length === 1 && 'col-span-2 h-auto'}`}>
                        <img src={url} alt="image" className="rounded-lg object-cover h-full hover:scale-105 transition-all duration-500" />
                    </div>
                ))}
            </div>

            {/* likes comments */}
            <div className="border-t-2 w-full pt-3 border-gray-300 text-gray-600 space-x-4 inline-flex">
                <div className={`flex items-center gap-1 ${likes.includes(currentUser._id) && "text-red-600 fill-red-600"}`}
                onClick={handleLike}>
                    <Heart className={`size-5 cursor-pointer ${likes.includes(currentUser._id) && "text-red-600 fill-red-600"}`}/>
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