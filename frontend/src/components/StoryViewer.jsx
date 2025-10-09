import { BadgeCheck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";


const StoryViewer = ({ setViewStory, viewStory }) => {
    if (!viewStory) return null

    const [progressBar, setProgressBar] = useState(0)
    const videoRef = useRef()

    useEffect(() => {
      let timer, progressInterval;

        if (viewStory.media_type !== 'video') {
            setProgressBar(0)
            const duration = 8_000;
            const setTime = 100;
            let progress = 0;

            progressInterval = setInterval(() => {
                progress += setTime
                setProgressBar((progress/duration)*100)
            }, setTime);
            
            timer = setTimeout(() => {
                setViewStory(null)
            }, duration); 

        }else{
            // setProgressBar(videoRef.current.currentTime)
            console.log(videoRef.current.currentTime);
        }
    
      return () => {
        clearInterval(progressInterval)
        clearTimeout(timer)
      }
    }, [viewStory])
    

    const renderContent = () => {
        switch (viewStory.media_type) {
            case 'image':
                return (
                    <img src={viewStory.media_url} alt="story image" className="object-contain object-center w-full max-h-full" />
                );
            case 'video':
                return (
                    <video ref={videoRef} src={viewStory.media_url} onEnded={() => setViewStory(null)} autoPlay controls className="object-contain max-h-full  object-center w-full " />
                )
            default: return <p className="p-4 text-lg">{viewStory.content}</p>
        }
    }

    return (
        <div className="fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4 ">
            <div className="w-md  h-screen flex flex-col relative" style={{ backgroundColor: viewStory.media_type === "text" ? viewStory.background_color : "black" }}>

                {/* progress bar */}
                <div className="fixed top-0 inset-x-0 h-1 bg-gray-500 z-200">
                    <div className="h-full bg-white transition-all ease-linear" style={{ width: `${progressBar}%` }} ></div>
                </div>

                {/* header  */}
                <div className="flex items-center justify-between px-4 py-2 absolute top-0 inset-x-0 z-200">
                    <Link to={`/profile/${viewStory.user?._id}`} className="space-x-3 p-2 bg-black/20 backdrop-blur-lg flex rounded cursor-pointer">
                        <img src={viewStory.user?.profile_picture} alt="dp" className="size-7 rounded-full object-cover ring-white ring" />
                        <div className="text-white flex items-center gap-1.5">
                            <span>{viewStory.user?.full_name}</span>
                            <BadgeCheck />
                        </div>
                    </Link>
                    <button className="p-2 cursor-pointer" onClick={() => setViewStory(null)}>
                        <X />
                    </button>
                </div>

                {/* content  */}
                <div className="h-full w-full flex items-center justify-center  " >
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default StoryViewer;