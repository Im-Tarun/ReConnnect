import { useState } from "react";
import { dummyUserData } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { Image, X } from "lucide-react";
import toast from "react-hot-toast";


const CreatePost = () => {
  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  
  const [loading, setLoading] = useState(false)

  const user = dummyUserData

  const handleCreatePost = async()=>{
    setContent('')
    setImages([])
    return true
  }

  const navigate = useNavigate()

  return (
    <div className="bg-gradient-to-b from-slate-200 to-white min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        {/* title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Post</h1>
          <p className="text-md text-slate-600">Share your thoughts with the world.</p>
        </div>

        {/* post  */}
        <div className=" max-w-xl bg-white p-6 py-4 shadow rounded">
          {/* profile info  */}
          <div onClick={() => navigate(`/profile`)} className="flex gap-2">
            <img src={user.profile_picture} alt="dp" className="size-12 rounded-full cursor-pointer" />
            <div className="flex-1 ">
              <p className="font-medium text-slate-700 cursor-pointer">{user.full_name}</p>
              <p className="text-slate-500 ">@{user.username} </p>
            </div>
          </div>

          {/* text heading for post  */}
          <div className="h-20 w-full mt-8">
            <textarea name="tarun" className="text-slate-800 placeholder-gray-400 placeholder:text-[16px] placeholder:font-light w-full h-full bg-transparent text-lg resize-none focus:outline-none no-scrollbar" placeholder="What's on you mind..."
              onChange={(e) => setContent(e.target.value)}
              value={content}
            />
          </div>

          {/* show images  */}
          {images.length > 0 && <div className="flex flex-wrap gap-2 my-4"> {
            images.map((img,ind)=>(
            <div key={ind} className="relative group ">
                <img src={URL.createObjectURL(img)} alt="your img" className="h-25 rounded cursor-pointer" />
                <div className="absolute hidden group-hover:flex justify-center items-center inset-0 bg-black/40 rounded cursor-pointer"
                onClick={()=>setImages(images.filter(url=> url !== img))}>
                  <X className="w-6 h-6 text-white"/>
                </div>
            </div>))}
          </div>}

          {/* add images and publish */}
          <div className="flex items-center justify-between border-t border-gray-300 pt-4">
             <label htmlFor="imageUp" >
                <Image className="text-slate-500 h-7 w-7"/>
             </label>
             <input type="file" id="imageUp" multiple className="hidden" accept="images/*" onChange={(e) => setImages([...images, ...e.target.files])}/>

             <button disabled={!(images.length > 0 || content.length > 0) || loading } className="py-1.5 px-4 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white active:scale-95 transition-all cursor-pointer" 
             onClick={() => toast.promise(handleCreatePost(), {
                        loading: "uploading...",
                        success: "Post Added Successfully",
                        error: e => `${e.message}`
                    })}>
              Publish Post</button>
          </div>


        </div>

      </div>
    </div>
  );
};

export default CreatePost;