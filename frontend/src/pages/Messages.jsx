import { MessageSquare } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

const Messages = () => {
  const navigate = useNavigate()
  const {connections: friends} = useSelector(state=> state.connections)

  return (
    <div className="h-screen relative bg-gradient-to-b from-slate-200 to-white overflow-y-scroll  ">
      <div className="max-w-6xl mx-auto p-6">
        {/* title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Messages</h1>
          <p className="text-md text-slate-600">Talk to friends and family</p>
        </div>

        {/* connect users chat  */}
        <div className="flex flex-col gap-4">
          {friends?.map((conn, ind) => (
            <div key={ind} className="max-w-xl  p-4 rounded-md shadow-md bg-white">
              {/* porfile detail  */}
              <div className="flex items-start gap-4">
                <img src={conn.profile_picture} alt="dp" className="size-12 rounded-full cursor-pointer object-cover" onClick={() => navigate(`/profile/` + conn._id)} />
                <div className="flex-1 ">
                  <p onClick={() => navigate(`/profile/` + conn._id)} className="font-medium text-slate-700 cursor-pointer">{conn.full_name}</p>
                  <p className="text-slate-500 ">@{conn.username} </p>
                </div>

                {/* message  */}
                <Link to={`/messages/${conn._id}`} className="flex items-center justify-center text-sm rounded bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all cursor-pointer p-2 " >
                  <MessageSquare className="size-4.5 text-gray-800" />
                </Link>
              </div>
              <p className="text-slate-600 mt-1 p-1">{conn.bio}</p>
            </div>

          ))}

        </div>

      </div>

    </div>
  )
}

export default Messages
