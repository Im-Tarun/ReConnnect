import { Link, NavLink } from "react-router-dom"
import { assets, dummyUserData, menuItemsData } from "../assets/assets"
import { CirclePlus, LogOut } from "lucide-react"
import {UserButton, useClerk} from "@clerk/clerk-react"

const SideBar = ({sidebarBtn, setSidebarBtn}) => {
  const {signOut} = useClerk()
  const {username, full_name} = dummyUserData

  return (
    <div className={`max-w-60 xl:w-72 bg-white border-r border-gray-300 flex flex-col justify-between items-center sm:h-screen max-sm:absolute top-0 bottom-0 z-20 ${sidebarBtn? 'max-sm:translate-x-0' : 'max-sm:-translate-x-full'} transition-all duration-400 ease-in-out`}>
      <div className="w-full">
          <img src={assets.logo} alt="logo" className="w-26 ml-7 my-2 cursor-pointer" />
          <hr className="border-gray-300 mb-8"/>
          <div className="px-5 text-gray-600 space-y-1 font-medium">
              {menuItemsData.map(({to,label,Icon})=>(
                <NavLink
                  key={label}
                  to={to}
                  end={ to === '/'}
                  onClick={()=> setSidebarBtn(false)}
                  className={({isActive})=>`px-3 py-2 flex items-center gap-3 rounded-xl ${isActive? 'bg-indigo-50 text-indigo-700': 'hover:bg-indigo-50'}`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                  </NavLink>
              ))}
          </div>
          <Link to={'/create-post'} className="flex items-center justify-center gap-2 m-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white active:scale-95 transition-all cursor-pointer"
          onClick={()=> setSidebarBtn(false)}>
              <CirclePlus className="h-5 w-5"/>
              <p>Create Post</p>
          </Link>
      </div>
      <div className="w-full border-t border-gray-300 p-4 px-5 flex items-center justify-between">
        <div className="flex gap-2 items-center cursor-pointer">
          <UserButton />
          <div>
            <h2 className="text-sm font-medium">{full_name}</h2>
            <p className="text-xs font-bold text-gray-500">@{username}</p>
          </div>
        </div>
        <LogOut onClick={signOut} className="w-4.5 text-gray-400 hover:to-gray-700 transition cursor-pointer"/>
      </div>
    </div>
  )
}

export default SideBar