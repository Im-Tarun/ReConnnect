import { Star } from "lucide-react"
import { assets } from "../assets/assets"
import {SignIn} from '@clerk/clerk-react'

const Login = () => {
    return (
        <main className="flex justify-evenly flex-col md:flex-row items-center relative min-h-dynamic w-full ">
            <img src={assets.bgImage} alt="background-Image" className="absolute top-0 left-0 -z-10 w-full h-full object-cover " />
            <div className="fixed bg-white/10 backdrop-blur-sm top-0 w-full px-8 pt-2 ">
                <img src={assets.logo} alt="logo" className="h-10 object-contain mt-2" />
            </div>

            {/* left intro  */}
            <div className="left-side flex flex-1 flex-col justify-center gap-2 p-6 pt-20 xl:p-40 ">
                <div className="flex items-center gap-3 mb-4 max-md:mt-10">
                    <img src={assets.group_users} alt="users" className="h-8 md:h10" />
                    <div>
                        <div className="flex">{Array(5).fill(1).map((_, i)=>(
                            <Star key={i} className="size-4 md:size-5 fill-amber-500 text-transparent"/>
                        ))}
                        </div>
                        <p>Used by 12k+ developers</p>
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-6xl md:pb-2 font-bold bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent">More than just friends truly connect </h1>
                <p className="text-xl md:text-2xl md:pb-2 bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent">connect with global community on Reconnect</p>
            </div>

            {/* right form  */}
            <div className="flex flex-1 items-center justify-center  p-6">
                <SignIn />
            </div>
        </main>
    )
}

export default Login

