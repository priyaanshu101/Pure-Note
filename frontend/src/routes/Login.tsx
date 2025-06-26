import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Navbar } from "./Navbar";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleClick() {
  try {
    const response = await axios.post("http://localhost:3000/api/v1/login", {
      username,
      password,
    });

    const token = (response.data as { token: string }).token;
    console.log(token);

    localStorage.setItem("token", token);
    setUsername("");
    setPassword("");
    navigate("/userPage");
  } catch (e) {
    alert("Login failed");
  }
}

  return (
    <div>
      <Navbar />
      <div className="h-screen pt-40 pb-20 px-6 text-center bg-[linear-gradient(to_right,_#9ca3af,_#f1f2f4,_#9ca3af)]">
        <div className="flex flex-col items-center max-w-3xl mx-auto backdrop-blur-2xl bg-white/60 p-10 rounded-3xl shadow-xl">
          <h4 className="md:text-5xl font-extrabold mb-6">Login</h4>

          <div className="flex flex-col mb-6 gap-5">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username or email"
              className="w-80 pl-12 pr-4 py-4 text-base rounded-2xl shadow-md border focus:ring-2 outline-none"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-80 pl-12 pr-4 py-4 text-base rounded-2xl shadow-md border focus:ring-2 outline-none"
            />
          </div>

          <button
            onClick={handleClick}
            className="w-80 h-[50px] bg-primary-800 text-white font-semibold text-xl rounded-xl hover:bg-primary-900 transition-all"
          >
            Login
          </button>

          <div className="pt-6 text-gray-500">
            Don't have an account?{" "}
            <span className="text-gray-900 font-semibold">
              <Link to="/signup">Create one here</Link>
            </span>
            <div className="text-gray-900 pt-2 font-semibold">
              <Link to="/forgotPass">Forgot Password?</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
