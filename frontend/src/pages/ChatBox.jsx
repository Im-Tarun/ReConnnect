import { useEffect, useRef, useState } from "react"
import { dummyMessagesData, dummyUserData } from "../assets/assets"
import moment from "moment"
import { Image, SendHorizonal, X } from "lucide-react"

const ChatBox = () => {
  const [text, setText] = useState("")
  const [image, setImage] = useState(null)
  const user  = dummyUserData
  const lastMsgRef = useRef()

  const messages = dummyMessagesData

  const sendMessage = async()=>{
    setText('')
    setImage(null)

  }

  const scrollToNewMsg =()=>{
    lastMsgRef.current?.scrollIntoView({behavior: "smooth"})
  }

  useEffect(() => {
    scrollToNewMsg()
  
  }, [messages])
  
  
  return (
    <div className="flex flex-col h-screen">
      {/* header */}
      <div className="flex items-center gap-2 px-2 py-[4.7px] md:px-10 xl:pl-32  bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-300">
        <img src={user.profile_picture} alt="dp" className="size-8 rounded-full"/>
        <div>
          <p>{user.full_name} </p>
          <p className="text-sm  text-gray-500">@{user.username} </p>
        </div>
      </div>

      {/* messages  */}
      <div className="h-full overflow-y-scroll no-scrollbar p-5 md:px-10">
        <div className="max-w-6xl mx-auto space-y-4">
          {messages.toSorted((a, b)=> new Date(a.createdAt)- new Date(b.createdAt)).map((msg, ind)=>(
            <div className={`flex flex-col ${msg.to_user_id === user._id ? "items-end" : " items-start"}`}>
              <div className={`p-2 text-sm max-w-sm bg-white text-slate-600 rounded-md shadow ${msg.to_user_id === user._id ? "rounded-br-none" : "rounded-bl-none"} `}>
                {msg.message_type === "image" ? <img src={msg.media_url} alt="msg img"  className="w-full max-w-sm rounded mb-2"/> :
                <p className="-1">{msg.text}</p>}
              </div>
              <span className="text-xs text-slate-400 p-1 font-medium ">{moment(msg.createdAt).format("hh:mm A")}</span>
            </div>
          ))}
          <div ref={lastMsgRef}/>
        </div>
      </div>     

      <div className="px-4">
          <div className='flex items-center gap-3 pl-6  p-1 bg-white w-full max-w-xl mx-auto border border-gray-200 shadow rounded-full mb-5'>
            <input type="text" className='flex-1 h-10 outline-none text-slate-700' placeholder='Type a message ... '
            onKeyDown={(e)=> e.key === "Enter" && sendMessage()} value={text}  onChange={(e)=>setText(e.target.value)}/>

            <label htmlFor="msgImage" >
              <input  type="file" id="msgImage" accept="image/*" hidden onChange={(e)=> setImage(e.target.files[0])}/>
              {image ? <img src={URL.createObjectURL(image)} alt="img" className="h-10 rounded" /> : <Image className="size-7"/>}  
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
