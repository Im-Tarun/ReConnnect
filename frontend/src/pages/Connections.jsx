import { useNavigate } from "react-router-dom"
import {
  dummyConnectionsData as friends,
  dummyFollowersData as followers,
  dummyPendingConnectionsData as pendingFriends,
  dummyFollowingData as followings
} from "../assets/assets"
import { MessageSquare, UserCheck, UserPlus, UserRoundPen, Users } from "lucide-react"
import { useState } from "react"



const Connections = () => {
  const [currentTab, setCurrentTab] = useState("Followers")

  const navigate = useNavigate()

  const connectionData = [
    { label: "Followers", value: followers, icon: Users },
    { label: "Followings", value: followings, icon: UserCheck },
    { label: "Pending", value: pendingFriends, icon: UserRoundPen },
    { label: "Friends", value: friends, icon: UserPlus }
  ]

  const handleAccept = ()=>{

  }
  const handleUnfollow = ()=>{

  }

  return (
    <div className=" bg-gradient-to-b from-slate-200 to-white h-screen overflow-y-scroll no-scrollbar">
      <div className="max-w-6xl p-6 mx-auto">

        {/* heading  */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Connections</h1>
          <p className="text-md text-slate-600">See connectoins and Manage your network</p>
        </div>

        {/* counts  */}
        {/* <div className=" mb-8 flex flex-wrap gap-5 justify-center max-w-[calc(39rem-1px)]">
          {connectionData.map((data)=>(
            <div key={data.label} className="bg-white py-4 px-8 rounded-md shadow border-gray-300 border-2 flex flex-col items-center w-35">
              <b >{data.value.length}</b>
              <p className="text-slate-600 text-sm">{data.label}</p>
            </div>
          ))}
        </div> */}

        {/* tabs */}
        <div className="rounded mb-8 inline-flex flex-wrap justify-center bg-slate-100 gap-x-4 gap-y-1 max-lg:p-1 shadow-sm border-gray-300 border-2 ">
          {connectionData.map((tab) => (
            <button key={tab.label} className={`space-x-1 px-4 rounded-sm w-40 max-lg:py-1 py-2 justify-center flex items-center ${currentTab === tab.label ? "text-black bg-white font-medium" : "text-gray-500 hover:text-black"}`}
              onClick={() => setCurrentTab(tab.label)}>
              <tab.icon className="size-5" />
              <p >{tab.label}</p>
              <span>{tab.value.length}</span>
            </button>
          ))}
        </div>


        {/* /Friends  */}
        <div className="flex flex-wrap gap-6  max-md:justify-center ">
          {connectionData.find(elem => elem.label === currentTab).value.map((user, ind) => (
            <div key={ind} className="max-w-md  p-4 rounded-md shadow-md bg-white">
              <div className="flex items-start  gap-4">
                <img src={user.profile_picture} alt="dp" className="size-12 rounded-full cursor-pointer" onClick={() => navigate(`/user/` + user._id)} />
                <div className="flex-1 cursor-pointer" onClick={() => navigate(`/user/` + user._id)} >
                  <p className="font-medium text-slate-700 ">{user.full_name}</p>
                  <p className="text-slate-500 ">@{user.username} </p>
                </div>
              </div>
              <p className="text-slate-600 mt-1 p-1">{user.bio}</p>

              {/* message button  */}
              {currentTab === "Friends" && <button onClick={() => navigate('/messages/' + user._id)} className="flex items-center justify-center bg-slate-200 hover:bg-slate-300 w-full rounded py-2 gap-1 active:scale-95 transition">
                <MessageSquare className="size-4.5 text-gray-800" />
                <span>Message</span>
              </button>}

              {/* Accept button  */}
              {currentTab === "Pending" && <button onClick={handleAccept} className="flex items-center justify-center bg-slate-200 hover:bg-slate-300 w-full rounded py-2 gap-1 active:scale-95 transition">
                <span>Accept</span>
              </button>}

              {/* unfollow button  */}
              {currentTab === "Followings" && <button onClick={handleUnfollow} className="flex items-center justify-center bg-slate-200 hover:bg-slate-300 w-full rounded py-2 gap-1 active:scale-95 transition">
                <span>Unfollow</span>
              </button>}
            </div>
          ))}
        </div>


      </div>

    </div>
  )
}

export default Connections
