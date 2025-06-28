import React from "react";
import { Button } from "../components/UI/Button";
import { AppLogo } from "../icons/AppLogo";
import { Layout } from "./Layout";
import { CaptureIcon } from "../icons/CaptureIcon";
import { SearchIcon } from "../icons/SearchIcon";
import { ConnectedIcon } from "../icons/ConnectedIcon";
import { Link } from "react-router-dom";
import { Navbar } from "./Navbar";

export default function Home() {
  const token = localStorage.getItem("token");
  const route = token ? "/userPage" : "/login";
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 text-primary-900 font-inter">
      <Navbar/>

      {/* Hero Section */}
<section className="pt-32 pb-20 px-6 text-center relative z-10 bg-[linear-gradient(to_right,_#9ca3af,_#f1f2f4,_#9ca3af)]">
  {/* Hero Content Box */}
  <div className="max-w-4xl mx-auto backdrop-blur-2xl bg-white/60 p-10 rounded-3xl shadow-xl border border-primary-200 relative z-10">
    <h2 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
      Your{" "}
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-700 to-primary-400">
        Second Brain
      </span>{" "}
      
    </h2>

    <p className="text-lg md:text-xl text-primary-700 mb-8 leading-relaxed">
      Collect links, notes, and knowledge from everywhere. Let Us organize,
      connect, and retrieve them when you need.
    </p>

    {/* Search Input */}
    <div className="relative max-w-xl mx-auto mb-6">
      <input
        type="text"
        placeholder="Ask something like 'Find my AI notes'"
        className="w-full pl-12 pr-4 py-4 text-base rounded-2xl shadow-md bg-white/70 backdrop-blur-xl border border-primary-200 focus:ring-2 focus:ring-primary-500 outline-none"
      />
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <svg
          className="w-5 h-5 text-primary-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>

    {/* CTA Button */}
    <div className="flex justify-center items-center">
      <Link to={route}><Button size={"lg"} variant="primary" text={"Start Using Pure Note"}/></Link>
    </div>
  </div>
</section>


      
      {/* Feature Section (just layout idea) */}
      <section id="features" className="py-20 px-6 bg-[linear-gradient(to_right,_#9ca3af,_#f1f2f4,_#9ca3af)] ">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h3 className="text-4xl font-bold mb-4">Features</h3>
          <p className="text-primary-600 text-lg max-w-2xl mx-auto">
            Smart capture, intelligent clustering, AI search, link organization, and more.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Layout icon={<CaptureIcon/>} title={"Quick Capture"} text={"Save web pages, notes, and thoughts with smart tagging"}/>
          <Layout icon={<SearchIcon/>} title={"Smart Search"} text={"Find your content instantly with AI-powered search"}/>
          <Layout icon={<ConnectedIcon/>} title={"Connected"} text={"Discover connections between your saved content"}/>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-900 text-white py-12 mt-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h5 className="text-xl font-bold mb-3">Pure Note</h5>
            <p className="text-primary-300 text-sm">
              Your AI-powered second brain. Open source and privacy focused.
            </p>
          </div>
          <div>
            <h6 className="text-lg font-semibold mb-2">Links</h6>
            <ul className="text-primary-300 text-sm space-y-1">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#about" className="hover:text-white">About</a></li>
              <li><a href="#vault" className="hover:text-white">Vault</a></li>
            </ul>
          </div>
          <div>
            <h6 className="text-lg font-semibold mb-2">Resources</h6>
            <ul className="text-primary-300 text-sm space-y-1">
              <li><a href="#" className="hover:text-white">GitHub</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Docs</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-primary-400 text-xs mt-8">&copy; 2025 Pure Note</div>
      </footer>
    </main>
  );
}