import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import UserCard from "../components/UserCard"
import Loading from "../components/Loading"
import api from "../api/axios.js"
import { useAuth } from "@clerk/clerk-react"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
import { fetchUser } from "../features/user/userSlice"

const Discover = () => {

  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const {getToken} = useAuth()
  const dispatch = useDispatch()

  const handleSearch = async(e) => {
    if (e.key === "Enter") {
      try {
        setUsers([])
        setLoading(true)
        const {data} = await api.post("/api/user/discover",{input: e.target.value},{
          headers: {Authorization: `Bearer ${await getToken()}`}
        })
        
        data.success ? setUsers(data.users) : toast.error(data.message)
        
      } catch (error) {
        console.log(error)
      } finally{
        setLoading(false)
      }
  }}

  useEffect(() => {
    getToken().then(token=>dispatch(fetchUser(token)))
  }, [])
  

  return (
    <div className="h-dynamic overflow-y-scroll no-scrollbar bg-gradient-to-b from-slate-200 to-white">
      <div className="max-w-6xl p-6 mx-auto ">

        {/* heading  */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Discover People</h1>
          <p className="text-md text-slate-600">Connect with amazing people and grow your network.</p>
        </div>

        {/* search bar */}
        <div className="p-6 shadow w-full rounded-md bg-white">
          <div className=" relative">
            <Search className=" absolute top-2 left-2 text-gray-800" />
            <input type="text" className=" w-full p-2 pl-10 border-2 border-gray-300  rounded-md " placeholder="Search people by Name and Username" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleSearch} />
          </div>
        </div>

        {/* display accounts  */}
        <div className="w-full mt-10 flex flex-wrap gap-4 justify-evenly">
          {loading ? <Loading height="50vh" /> : users.map((user, ind) => (
            <UserCard key={ind} user={user} />
          ))}
        </div>

      </div>
    </div>
  )
}

export default Discover
