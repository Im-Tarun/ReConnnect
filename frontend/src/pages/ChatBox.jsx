import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import moment from "moment"
import { Image, SendHorizonal, X } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useAuth } from "@clerk/clerk-react"
import { addMessages, fetchMessages, resetMessages } from "../features/messages/messagesSlice"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast"
import api from "../api/axios.js"

const ChatBox = () => {
  const [user, setUser] = useState(null)
  const [text, setText] = useState("")
  const [image, setImage] = useState(null)
  const lastMsgRef = useRef(null)
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const dispatch = useDispatch()
  const { getToken } = useAuth()

  const { userId } = useParams()
  const {messages} = useSelector(state => state.messages)
  const {connections} = useSelector(state => state.connections)

  const sendMessage = useCallback(async () => {
    if (!text.trim() && !image) return toast.error("Message can't be empty")
    try {
      const formData = new FormData()
      formData.append('to_user_id', userId)
      formData.append('text', text)
      image && formData.append('image', image)

      const {data} = await api.post("/api/message/send", formData, {
        headers: {Authorization: `Bearer ${await getToken()}`}
      })
      if(data.success) dispatch(addMessages(data.newMessage))
      setImage(null)
      setText('')

    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Something went wrong.")      
    } 
  },[text, image, dispatch, userId])


  useEffect(() => {
    getToken().then(token => dispatch(fetchMessages({ token, userId })))
    return()=>{
      dispatch(resetMessages())
    }
  }, [userId, dispatch])


useLayoutEffect(() => {
  if (!messages?.length || !lastMsgRef.current) return;

  if (isFirstLoad) {
    lastMsgRef.current.scrollIntoView({ behavior: "auto", block: "end" });
    setIsFirstLoad(false);
  } else {
    lastMsgRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }
}, [messages]);
  
  useEffect(() => {
    if(connections.length > 0){
      const user = connections.find(connection=> connection._id === userId)
      setUser(user)
    }
  }, [connections, userId])
  

  return (
    <div className="flex flex-col h-dynamic">
      {/* header */}
      <div className="flex items-center gap-2 px-2 py-[4.7px] md:px-10 xl:pl-32  bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-300">
        <img src={user?.profile_picture} alt="dp" className="size-8 rounded-full object-cover cursor-pointer" />
        <div>
          <p>{user?.full_name} </p>
          <p className="text-sm  text-gray-500">@{user?.username} </p>
        </div>
      </div>

      {/* messages  */}
      <div className="h-full overflow-y-scroll no-scrollbar p-5 md:px-10">
        <div className="max-w-6xl mx-auto space-y-4">
          {messages?.toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((msg, ind) => (
            <div key={ind} className={`flex flex-col ${msg.to_user_id === user?._id ? "items-end" : " items-start"}`}>
              <div className={`p-2 text-sm max-w-sm bg-white text-slate-600 rounded-md shadow ${msg.to_user_id === user?._id ? "rounded-br-none" : "rounded-bl-none"} `}>
                {msg.message_type === "image" ? <img src={msg.media_url} alt="msg img" className="w-full max-w-sm rounded mb-2" /> :
                  <p className="-1">{msg.text}</p>}
              </div>
              <span className="text-xs text-slate-400 p-1 font-medium ">{moment(msg.createdAt).format("hh:mm A")}</span>
            </div>
          ))}
          <p ref={lastMsgRef} ></p>
        </div>
      </div>

      <div className="px-4">
        <div className='flex items-center gap-3 pl-6  p-1 bg-white w-full max-w-xl mx-auto border border-gray-200 shadow rounded-full mb-5'>
          <input type="text" className='flex-1 h-10 outline-none text-slate-700' placeholder='Type a message ... '
            onKeyDown={(e) => e.key === "Enter" && sendMessage()} value={text} onChange={(e) => setText(e.target.value)} />

          <label htmlFor="msgImage" >
            <input type="file" id="msgImage" accept="image/*" hidden onChange={(e) => setImage(e.target.files[0])} />
            {image ? <img src={URL.createObjectURL(image)} alt="img" className="h-10 rounded" /> : <Image className="size-7" />}
          </label>

          <button onClick={sendMessage} className="cursor-pointer bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white active:scale-85 transition-all rounded-full p-2">
            <SendHorizonal />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatBox
