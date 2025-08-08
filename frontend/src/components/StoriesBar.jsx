import { useEffect, useState } from "react"
import { dummyStoriesData } from "../assets/assets"
import Loading from "./Loading"
import { Plus } from "lucide-react"
import moment from "moment"

const StoriesBar = () => {
    const [stories, setStories] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchStories = () => {
        setStories(dummyStoriesData)
        setIsLoading(false)
    }
    useEffect(() => {
        fetchStories()

    }, [])


    return !isLoading ? (
        <div className="w-screen sm:w-[calc(100vw-240px)] lg:max-w-2xl  px-4 overflow-x-scroll ">
            <div className="flex gap-4 pb-5  ">
                {/* add story  */}
                <div className="rounded-lg shadow-sm min-w-30 max-h-40 aspect-[3/4] cursor-pointer hover:shadow-lg transition-all duration-200 border-2 border-dashed border-indigo-300 bg-gradient-to-b from-indigo-50 to-white">
                    <div className="h-full flex flex-col items-center justify-center p-4">
                        <div className="p-2 rounded-full bg-indigo-500 flex items-center justify-center">
                            <Plus />
                        </div>
                        <h1 className="pt-2 text-gray-600">Create Post</h1>
                    </div>

                </div>
                {/* stories  */}
                {
                    stories.map((story) => (
                        <div key={story._id} className="rounded-lg shadow min-w-30 max-w-30 max-h-40 cursor-pointer hover:shadow-lg transition-all duration-200  bg-gradient-to-b from-indigo-500 to-purple-600 active:scale-95 relative">
                            <img src={story.user.profile_picture} alt="dp"
                                className="absolute size-8 top-3 left-3 z-10 rounded-full  ring ring-gr " />
                            <p className="absolute top-18 let-3 z-10 text-white/80 text-sm truncate max-w-24">{story.content}</p>
                            <p className="absolute bottom-1 text right-3 text-white z-10 text-xs"> {moment(story.createdAt).fromNow}</p>
                            {
                                story.media_type !== 'text' && (
                                    <div className="absolute inset-0 z-1 rounded-lg bg-black overflow-hidden">
                                        {
                                            story.media_type === "image" ? <img src={story.media_url} alt="story" className="h-full w-full object-cover hover:scale-110 transition-all duration-500 opacity-75 hover:opacity-85" /> : <video className="h-full w-full object-cover hover:scale-110 transition-all duration-500 opacity-75 hover:opacity-85" src={story.media_url} />
                                        }
                                    </div>
                                )
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    ) : <Loading />
}

export default StoriesBar