import { Navbar } from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleClick() {
    console.log(username)
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/signup",
        { username, password }
      );
      setUsername("");
      setPassword("");
      if (response.status === 200) {
        navigate("/login");
        alert("You are Signed In");
      }
    } catch (e) {
      alert("Cannot Signup");
    }
  }

  return (
    <div>
      <Navbar />
      <div className="h-screen pt-40 pb-20 px-6 text-center relative z-10 bg-[linear-gradient(to_right,_#9ca3af,_#f1f2f4,_#9ca3af)]">
        <div className="flex flex-col justify-center items-center max-w-3xl mx-auto backdrop-blur-2xl bg-white/60 p-10 rounded-3xl shadow-xl border border-primary-200 relative z-10">
          <h4 className="md:text-5xl font-extrabold leading-tight mb-6">
            Sign Up
          </h4>

          <div className="flex flex-col relative max-w-xl mx-auto mb-6 gap-5">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username or email"
              className="w-80 pl-12 pr-4 py-4 text-base rounded-2xl shadow-md bg-white/70 backdrop-blur-xl border border-primary-200 focus:ring-2 focus:ring-primary-500 outline-none"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-80 pl-12 pr-4 py-4 text-base rounded-2xl shadow-md bg-white/70 backdrop-blur-xl border border-primary-200 focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>

          <div className="flex justify-center items-center">
            <button
              onClick={handleClick}
              className="w-80 h-[50px] bg-primary-800 text-white font-semibold text-xl hover:bg-primary-900 shadow-lg hover:scale-105 transition-all duration-300 ease-out will-change-transform px-4 py-2 rounded-xl"
            >
              Sign Up
            </button>
          </div>

          <div className="pt-6 text-gray-500">
            Already have an account?{" "}
            <span className="text-gray-900 font-semibold">
              <Link to="/login">Login</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
