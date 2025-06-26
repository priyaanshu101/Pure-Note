import { Link } from "react-router-dom";
import { Navbar } from "./Navbar";

export default function ForgotPassword(){
    return (
      <div>
        <Navbar/>
        <div className="h-screen pt-40 pb-20 px-6 text-center relative z-10 bg-[linear-gradient(to_right,_#9ca3af,_#f1f2f4,_#9ca3af)]">
          <div className="flex flex-col justify-center items-center max-w-3xl mx-auto backdrop-blur-2xl bg-white/60 p-10 rounded-3xl shadow-xl border border-primary-200 relative z-10">
            <h4 className="md:text-5xl font-extrabold leading-tight mb-6">
             Forgot
            </h4>
    
            <div className="flex flex-col relative max-w-xl mx-auto mb-6 gap-5">
              <input
                type="text"
                placeholder="Username or email"
                className="w-80 pl-12 pr-4 py-4 text-base rounded-2xl shadow-md bg-white/70 backdrop-blur-xl border border-primary-200 focus:ring-2 focus:ring-primary-500 outline-none"
              />
              <input
                type="text"
                placeholder="Password"
                className="w-80 pl-12 pr-4 py-4 text-base rounded-2xl shadow-md bg-white/70 backdrop-blur-xl border border-primary-200 focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
        
            <div className="flex justify-center items-center">
                <button className="w-80 h-[50px] bg-primary-800 text-white font-semibold text-xl hover:bg-primary-900 shadow-lg hover:scale-105 transition-all duration-300 ease-out will-change-transform px-4 py-2 rounded-xl">Login</button>
            </div>
          </div>
        </div>
      </div>
    )
}