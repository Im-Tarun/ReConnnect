import { useEffect, useState } from "react"
import { dummyStoriesData } from "../assets/assets"
import Loading from "./Loading"

const StoriesBar = () => {
    const [stories, setStories] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchStories=()=>{
        setStories(dummyStoriesData)
        isLoading(false)
    }
    useEffect(() => {
      fetchStories()
    
    }, [])
    

  return !isLoading ? (
    <div className="w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl no-scrollbar overflow-x-scroll px-4">
        <div className="flex gap-4 pb-5">
            {/* add story  */}
            <div className="rounded-lg shadow-sm w-30 max-h-40 aspect-[3/4] cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white">

            </div>
            {/* stories  */}
            {stories.map((story)=>(
                <button> </button>
            ))}
        </div>
    </div>
  ) : <Loading/>
}

export default StoriesBar