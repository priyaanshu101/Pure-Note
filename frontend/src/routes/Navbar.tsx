import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/UI/Button"
import { AppLogo } from "../icons/AppLogo"
import { type ReactElement } from "react";
// import { nav } from "framer-motion/client";

interface NavbarProps {
  render?: () => ReactElement;
}

export function Navbar({ render }: NavbarProps): ReactElement {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const publicBrain = () => {
    navigate("/public/vault");
  };

  return (
    <nav className="fixed top-0 left-0 w-screen bg-white/30 backdrop-blur-xl shadow-sm border-b border-primary-200 z-50">
      <div className="mx-auto px-10 py-4 flex justify-between items-center">
        <Link to="/">
          <h1 className="flex gap-4 text-3xl font-bold tracking-tight">
            <AppLogo /> Pure Note
          </h1>
        </Link>
        <div className="hidden md:flex space-x-6 items-center">
          {!token && <>
            <Link to="/login" className="text-primary-600 hover:text-primary-900 transition">
            Login
          </Link>
          <Link to="/signup" className="text-primary-600 hover:text-primary-900 transition">
            Sign Up
          </Link>
          </>
          }
          {token && <div
            onClick={() => {
              localStorage.removeItem("token");
              render?.();
            }}
            className="text-primary-600 hover:text-primary-900 transition hover:cursor-pointer" 
            >Log Out</div>}
          <Button size="sm" variant="primary" text="Public Vault" onClick={publicBrain} />
        </div>
      </div>
    </nav>
  );
}
