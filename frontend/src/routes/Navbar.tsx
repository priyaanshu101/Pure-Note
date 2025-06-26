import { Link } from "react-router-dom"
import { Button } from "../components/UI/Button"
import { AppLogo } from "../icons/AppLogo"

export function Navbar(){
    return (
        <nav className="fixed top-0 left-0 w-screen bg-white/30 backdrop-blur-xl shadow-sm border-b border-primary-200 z-50">
            <div className="mx-auto px-10 py-4 flex justify-between items-center">
            <Link to='/'><h1 className=" flex gap-4 text-2xl font-bold text-3xl tracking-tight"><AppLogo/>Pure Note</h1></Link>
            <div className="hidden md:flex space-x-6 items-center">
                <Link to='/about' className="text-primary-600 hover:text-primary-900 transition">About</Link>
                <Link to='/login' className="text-primary-600 hover:text-primary-900 transition">Login</Link>
                <Link to='/signup' className="text-primary-600 hover:text-primary-900 transition">Sign Up</Link>
                <Button size={"sm"} variant="primary" text={"Public vault"}/>
            </div>
            </div>
        </nav>
    )
}