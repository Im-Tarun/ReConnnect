import { useEffect, useState } from "react"
import { dummyPostsData } from "../assets/assets"
import Loading from "../components/Loading"

const Feed = () => {
  const [feedPosts, setFeedPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchFeedPosts = ()=>{
    setFeedPosts(dummyPostsData)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchFeedPosts()
  
  }, [])
  
  return !isLoading? (
    <div className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center gap-4 xl:gap-8">
      {/* left feed  */}
      <div>
        {/* story */}
        <div>
          story
        </div>

        {/* {Posts} */}
        <div>
          post
        </div>
      </div>

      {/* Messages */}
      <div>
       sponser
      </div>

    </div>
  ) : <Loading/>
}

export default Feed
