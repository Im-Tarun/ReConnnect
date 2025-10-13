import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { useAuth, useUser } from "@clerk/clerk-react";
import api from "../api/axios.js";
import toast from "react-hot-toast";


const RecentMessages = () => {
  const [messages, setMessages] = useState([])
  const {getToken} = useAuth()
  const {user} = useUser()
  
  const fetchRecentMessages = async()=>{
      try {
        const {data} = await api.get('/api/message/recent',{
          headers: {Authorization: `Bearer ${await getToken()}`}
        })
        if(data.success){
          const groupedMessages = data.messages.reduce((acc, msg)=>{
            const senderId = msg.from_user_id._id 
            if(!acc[senderId] || new Date(msg.createdAt)> new Date(acc[senderId].createdAt)){
              acc[senderId] = msg
            }
            return acc
          }, {})

          const sortedMessages = Object.values(groupedMessages).sort((a, b)=>{
            new Date(b.createdAt) - new Date(a.createdAt)
          })

          setMessages(sortedMessages)
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        console.log(error);
      }
  }
  useEffect(() => {
    if(user){
      fetchRecentMessages()
      setInterval(fetchRecentMessages, 30000);
    }
    return ()=>{clearInterval()}
  
  }, [user])
  

  return (
    <div className="w-full p-3 min-h-20 mb-4 rounded-md text-slate-800 bg-white max-w-sm ">
      <h1 className="font-semibold text-lg text-slate-800 mb-3"> Recent messages</h1>
      <div className=" flex flex-col gap-2 max-h-60 overflow-y-scroll p-1 no-scrollbar ">
        {messages.map((msg, ind)=>(
            <Link to={`/messages/${msg.from_user_id?._id}`} key={ind} className="flex  rounded-md shadow-sm items-center gap-2 p-3 hover:bg-slate-100 active:scale-95 transition-all"  >
                <img src={msg.from_user_id?.profile_picture} alt="dp" className="w-8 h-8 rounded-full object-cover" />
                <div className="flex-1 max-w-[88%]">
                    <div className="flex justify-between items-center">
                        <p className="font-medium">{msg.from_user_id.full_name}</p>
                        <p className="text-slate-600 text-[10px]">{moment(msg.createdAt).fromNow()} </p>
                    </div>
                    <div className="flex justify-between items-center ">
                        <p className="text-sm text-slate-500 h-5 overflow-hidden  max-w-[80%]" style={{color: msg.seen ? "gray": "black"}}>{msg.message_type === "text" ? msg.text : "Media"}</p>
                        {!msg.seen &&  <p className="text-[10px] bg-indigo-500 text-white size-5 flex items-center justify-center rounded-full" > 1 </p>}
                    </div>

                </div>
            </Link>
        ))}
      </div>
    </div>
  );
};

export default RecentMessages;