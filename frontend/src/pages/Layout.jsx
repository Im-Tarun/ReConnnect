import { Outlet } from "react-router-dom"
import SideBar from "../components/SideBar"
import { useState } from "react"
import { Menu, X } from "lucide-react"


const Layout = () => {
  const [sidebarBtn, setSidebarBtn] = useState(false)

  return (
    <div className="w-full h-screen flex relative ">
      <SideBar sidebarBtn={sidebarBtn} setSidebarBtn={setSidebarBtn} />
      <div className="flex-1 bg-slate-100">
        <Outlet />
      </div>

      {sidebarBtn ? <X className="absolute top-3 bg-white right-3 size-8 p-2 z-100 rounded-md text-gray-6003 sm:hidden"
        onClick={() => setSidebarBtn(false)} /> : <Menu className="absolute top-3 bg-white right-3 size-8 p-2 z-100 rounded-md text-gray-6003 sm:hidden" onClick={() => setSidebarBtn(true)} />
      }
      
    </div>
  )
}

export default Layout
