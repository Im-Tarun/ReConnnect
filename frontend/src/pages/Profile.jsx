import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { dummyPostsData, dummyUserData } from "../assets/assets"
import UserProfileInfo from "../components/UserProfileInfo"
import PostCard from "../components/PostCard"
import moment from "moment"
import EditProfile from "../components/EditProfile"

const Profile = () => {
  const { profileId } = useParams()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('posts')
  const [posts, setPosts] = useState([])
  const [showEdit, setShowEdit] = useState(false)

  const fetchUserPost = () => {
    setUser(dummyUserData)
    setPosts(dummyPostsData)
  }

  useEffect(() => {
    fetchUserPost()
  }, [])


  return (
    <div className="relative h-full bg-gradient-to-b from-slate-200 to-white overflow-y-scroll no-scrollbar p-6">
      <div className="max-w-3xl mx-auto" >

        {/* user profile  */}
        <UserProfileInfo user={user} profileId={profileId} posts={posts} setShowEdit={setShowEdit} />

        {/* tabs */}
        <div className="mt-6 w-full">
          <div className=" mx-auto bg-white rounded-lg p-1 flex max-w-md">
            {["posts", "media", "likes"].map(tab => (
              <button key={tab} className={`capitalize flex-1 py-2 px-4 text-sm font-semibold rounded-lg ${activeTab === tab ? "bg-indigo-600 text-white" : " text-gray-600 hover:text-gray-900"}`} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "posts" && <div className="mt-6 flex flex-col gap-4 items-center">
          {posts.map((post, ind) => (
            <PostCard post={post} key={ind} />
          ))}
        </div>}

        {activeTab === "media" && <div className="mt-6 flex flex-wrap max-w-6xl gap-4 justify-center">
          {posts.filter(post => post.image_urls.length > 0).map(urlpost => (
            <>{urlpost.image_urls.map((url, ind) => (
              <Link key={ind} to={url} target="_blank" rel="noopener noreferrer" className="relative group">
                <img src={url} alt="das" className="h-52 aspect-video object-cover rounded" />
                <p className='absolute bottom-0 right-0 rounded text-xs p-1 px-3 backdrop-blur-xl text-white opacity-0 group-hover:opacity-100 transition duration-300' >Posted {moment(urlpost.createdAt).format()}</p>
              </Link>
            ))}
            </>
          ))}
        </div>}
      </div>

      {showEdit && <EditProfile setShowEdit={setShowEdit} /> }
    </div>
  )
}

export default Profile