import { useEffect, useState } from "react"
import { assets, dummyPostsData } from "../assets/assets"
import Loading from "../components/Loading"
import StoriesBar from "../components/StoriesBar"
import PostCard from "../components/PostCard"
import RecentMessages from "../components/RecentMessages"
import { useAuth } from "@clerk/clerk-react"
import api from "../api/axios.js"
import toast from "react-hot-toast"

const Feed = () => {
  const [feedPosts, setFeedPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const {getToken} = useAuth() 

  const fetchFeedPosts = async ()=>{
    try {
      const {data} = await api.get("/api/post/feed",{
        headers: {Authorization: `Bearer ${await getToken()}`}
      })

      if(data.success){
        setFeedPosts(data.allPost)
      }
      
    } catch (error) {
      console.log(error)
      toast.error("Error loading Feed posts")
    } finally{
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedPosts()
  
  }, [])

  
  return !isLoading? (
    <div className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center gap-4 xl:gap-8 ">
      {/* left side - feed  */}
      <div>
        {/* story */}
          <StoriesBar/> 

        {/* {Posts} */}
        <div className="p-4 space-y-4">
          {feedPosts.map((post)=>(
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>

      {/* right side - sponsor and Messages */}
      <div className="max-[1180px]:hidden sticky top-0 pr-2 inset-y-full">

          {/*recent messages  */}
        <RecentMessages/>

        {/* sponsor  */}
       <div className="max-w-sm bg-white text-xs p-4 inline-flex gap-2 flex-col rounded-md shadow ">
          <h3 className="text-slate-700 font-semibold">sponsored</h3>
          <img src={assets.sponsored_img} alt="sponsored img" className="rounded w-full h-56 " />
          <p className="text-slate-800 text-md">Email marketing</p>
          <p className="text-slate-500">Supercharge your marketing with a powerfull, easy-to-use platform build for result.</p>
       </div>

       
      
      </div>

    </div>
  ) : <Loading/>
}

export default Feed
