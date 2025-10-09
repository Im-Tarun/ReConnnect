import { ArrowLeft, Sparkle, TextIcon, Upload } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import api from "../api/axios.js"
import { useAuth } from "@clerk/clerk-react"

const CreateStory = ({ setshowCreateStory, fetchStories }) => {
    const bgColors = ["#7c3aed", "#db2777", "#e11d48", "#ca8a04", "#0d9488", "#4f46e5"]

    const [mode, setMode] = useState("text")
    const [background, setBackground] = useState(bgColors[0])
    const [text, setText] = useState("")
    const [media, setMedia] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const {getToken} = useAuth()

    const max_video_duration = 60; //sec
    const max_video_size = 30; //mb

    const handleMediaUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if(file.type.startsWith("video")){
                if(file.size > max_video_size * 1024 *1024){
                    toast.error(`video size exceeded ${max_video_size} MB`)
                    setMedia(null)
                    setPreviewUrl(null)
                    return;
                }
                const video = document.createElement("video")
                video.src = URL.createObjectURL(file)
                video.preload = 'metadata'
                video.onloadedmetadata = () =>{
                    window.URL.revokeObjectURL(video.src)
                    if(video.duration> max_video_duration){
                        toast.error(`video duration exceeded ${max_video_size} sec`)
                        setMedia(null)
                        setPreviewUrl(null)
                        return;
                    }
                }
            }
            setMedia(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
        setMode("media")
    }

    const handleCreateStory = async () => {
        try {
            const mediaType = mode === "media" ? media?.type.startsWith("image") ? "image" : "video" : "text";
            if(mediaType === "text" && text.length < 1 ) return toast.error("Please enter some text.");

            const storyData = new FormData();

            storyData.append("content", text)
            storyData.append("media_type", mediaType )
            storyData.append("background_color", background )
            storyData.append("media", media )
            
            const {data} = await api.post("/api/story/add", storyData ,{
                headers:{Authorization:`Bearer ${await getToken()}`}
            })

            if(data?.success){
                fetchStories()
            }

        } catch (error) {
            console.log(error)
            toast.error("Some error occurred")
        } finally {
            setshowCreateStory(false)
            setText("")
            setMedia(null)
            setPreviewUrl(null)
        }
    }

    return (
        <div className="fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4 ">
            {/* container */}
            <div className="w-full max-w-md space-y-3">
                {/* header  */}
                <div className="flex items-center justify-between">
                    <button className="p-2 cursor-pointer " onClick={() => setshowCreateStory(false)}>
                        <ArrowLeft />
                    </button>
                    <h1 className="text-lg font-semibold ">Create Story</h1>
                    <span className="w-10"></span>
                </div>

                {/* text/image/video preview  */}
                <div className=" rounded h-96 w-full " style={{ backgroundColor: background }}>
                    {mode === "text" && (
                        <textarea name="tarun" className=" placeholder:text-white/70 p-5 w-full h-full bg-transparent text-lg resize-none focus:outline-none no-scrollbar" placeholder="What's on you mind"

                            onChange={(e) => setText(e.target.value)}
                            value={text}
                        />
                    )}
                    {mode === "media" && previewUrl && (
                        media?.type.startsWith("image") ? (
                            <img src={previewUrl} alt="uploaded img" className="object-contain object-center w-full max-h-full" />
                        ) : (
                            <video src={previewUrl} className="object-contain max-h-full  object-center w-full" />
                        )
                    )}
                </div>

                {/* background color change  */}
                <div className="flex gap-2 ">
                    {bgColors.map((color) => (
                        <div key={color} style={{ backgroundColor: color }} className={`rounded-full ring-2 w-6 h-6 ${background !== color ? "ring-white/10" : "ring-white"}`}
                            onClick={() => setBackground(color)}
                        ></div>
                    ))}
                </div>

                {/* select mode and file */}
                <div className="w-full flex gap-2 ">
                    <button onClick={() => {
                        setMode("text")
                        setMedia(null)
                        setPreviewUrl(null)
                    }} className="flex-1 flex rounded gap-1 items-center text-md py-2.5 justify-center cursor-pointer" style={
                        mode === "text" ? { backgroundColor: "white", color: "black" } : { backgroundColor: "#27272a", color: "white" }
                    }>
                        <TextIcon className="h-5 w-5" />
                        <span>Text</span>
                    </button>
                    <label htmlFor="fileUpload" className="flex-1 rounded gap-1 text-md bg-gray-900 text-white flex items-center py-2.5 justify-center cursor-pointer" style={
                        mode === "media" ? { backgroundColor: "white", color: "black" } : { backgroundColor: "#27272a", color: "white" }
                    }>
                        <input type="file" id="fileUpload" className="hidden" accept="image/*, video/*" onChange={(e) => handleMediaUpload(e)} />
                        <Upload className="h-5 w-5" />
                        <span>Photo/Video</span>
                    </label>
                </div>

                {/* upload story  */}
                <button className="w-full rounded flex items-center justify-center gap-2 p-2.5 bg-gradient-to-l from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition cursor-pointer"
                    onClick={() => toast.promise(handleCreateStory(), {
                        loading: "uploading...",
                        success: "Story Added Successfully",
                        error: e => `${e.message}`
                    })}>
                    <Sparkle className="h-5 w-5" />
                    <span>Upload Story</span>
                </button>



            </div>

        </div>
    )
}

export default CreateStory