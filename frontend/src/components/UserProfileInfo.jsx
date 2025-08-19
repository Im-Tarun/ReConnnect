import { Calendar, Edit, MapPin, Verified } from "lucide-react";
import moment from "moment";


const UserProfileInfo = ({ user, posts, profileId, setShowEdit }) => {


  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      {/* cover photo  */}
      <div className="h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
        { user?.cover_photo && <img src={user?.cover_photo} alt=" user cover photo" className=" h-full w-full object-cover" />}
      </div>

      <div className="relative py-4 px-6 md:px-8 bg-white ">
      {/* dp */}
      <img src={user?.profile_picture} alt="" className="ring-4 h-32 w-32 ring-white absolute -top-16 rounded-full" />

      {/* profile name and edit  */}
      <div className="w-full pt-16 md:pt-0 md:pl-36 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 inline-flex items-center gap-2">{user?.full_name} <Verified className="w-6 h-6 text-blue-500" /></h1>
            <p className="text-gray-600">@{user?.username}</p>
          </div>
          {!profileId && <button onClick={() => setShowEdit(true)} className="text-gray-700 cursor-pointer"><Edit className="size-6" /></button>}
        </div>

        {/* bio */}
        <p className="text-sm text-gray-700 max-w-md ">{user?.bio}</p>

        {/* location and joined at */}
        <div className="flex gap-4 ">
          <div className="flex items-center justify-center gap-1.5 text-slate-600  rounded-full ">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">{user?.location} </span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-slate-600 rounded-full ">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Joined {moment(user?.createdAt).fromNow()}</span>
          </div>
        </div>

        {/* count  */}
        <div className="flex gap-4 pt-3 border-t border-gray-400 text-gray-800">
          <div className="max-sm:text-sm inline-flex items-baseline"><p className="sm:text-lg pr-2 font-bold">20{posts.length}</p>Posts </div>
          <div className="max-sm:text-sm inline-flex items-baseline"><p className="sm:text-lg pr-2 font-bold">20{user?.followers.length}</p>Followers </div>
          <div className="max-sm:text-sm inline-flex items-baseline"><p className="sm:text-lg pr-2 font-bold ">20{user?.following.length}</p>Followings</div>
        </div>

      </div>
    </div>

    </div>

  );
};

export default UserProfileInfo;