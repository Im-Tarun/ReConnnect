import { useEffect, useRef, useState } from "react"
import { dummyMessagesData, dummyUserData } from "../assets/assets"

const ChatBox = () => {
  const [text, setText] = useState("")
  const [image, setImage] = useState(null)
  const [user, setUser] = useState(dummyUserData)
  const lastMsgRef = useRef()

  const messages = dummyMessagesData

  const sendMessage = async()=>{

  }

  const scrollToNewMsg =()=>{
    lastMsgRef.current?.scrollIntoView({behavior: "smooth"})
  }

  useEffect(() => {
    scrollToNewMsg()
  
  }, [messages])
  
  
  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center gap-2 p-2 md:px-10 xl:pl-32  bg-gradient-to-r from-purple-50 to-pink-50">
      </div>
      
    </div>
  )
}

export default ChatBox
