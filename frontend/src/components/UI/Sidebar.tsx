import { Link } from "react-router-dom";
import { AllContentIcon } from "../../icons/AllContentIcon";
import { AppLogo } from "../../icons/AppLogo";
import { InstaIcon } from "../../icons/InstaIcon";
import { LinkIcon } from "../../icons/LinkIcon";
import { MusicIcon } from "../../icons/MusicIcon";
import { NotesIcon } from "../../icons/NotesIcon";
import { TwitterIcon } from "../../icons/TwitterIcon";
import { YoutubeIcon } from "../../icons/YoutubeIcon";
import { Button } from "./Button";
import { X } from "lucide-react";

interface SidebarProps {
  specificContent: (title: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isMobile: boolean;
}

interface OptionProps {
  icon: React.ReactElement;
  title: string;
  onClick: (title: string) => void;
}

export function Sidebar({ specificContent, sidebarOpen, setSidebarOpen, isMobile }: SidebarProps) {
  return (
    <div
      className={`${
        isMobile ? 'fixed' : 'relative'
      } top-0 left-0 h-screen w-64 bg-white border-r-2 border-gray-200 shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col justify-between h-full">
        {/* Header */}
        <div className="flex-1">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <AppLogo size="lg" />
              <Link to="/" className="flex-shrink-0">
                <div className="text-xl font-semibold text-gray-800 whitespace-nowrap">Pure Note</div>
              </Link>
            </div>
            
            {/* Close button - always visible */}
            <button
              className="p-1 rounded-md hover:bg-gray-100 transition-colors flex-shrink-0"
              onClick={() => setSidebarOpen(false)}
              title="Close sidebar"
            >
              <X size={20} className="text-gray-600"/>
            </button>
          </div>

          {/* Navigation Options */}
          <div className="flex flex-col py-4">
            <Option icon={<AllContentIcon size="md" />} title="All Content" onClick={specificContent} />
            <Option icon={<NotesIcon size="md" />} title="Notes" onClick={specificContent} />
            <Option icon={<TwitterIcon size="md" />} title="Twitter" onClick={specificContent} />
            <Option icon={<InstaIcon size="md" />} title="Instagram" onClick={specificContent} />
            <Option icon={<YoutubeIcon size="md" />} title="Youtube" onClick={specificContent} />
            <Option icon={<MusicIcon size="md" />} title="Music" onClick={specificContent} />
            <Option icon={<LinkIcon size="md" />} title="Link" onClick={specificContent} />
          </div>
        </div>

        {/* Footer with logout */}
        <div className="flex justify-center p-4 border-t border-gray-100">
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            text="Log Out"
          />
        </div>
      </div>
    </div>
  );
}

function Option({ icon, title, onClick }: OptionProps) {
  return (
    <div
      className="flex items-center px-4 py-3 gap-3 cursor-pointer hover:bg-primary-300 mx-2 rounded-lg transition-all duration-200 group"
      onClick={() => onClick(title)}
    >
      <div className="flex-shrink-0 text-gray-600 group-hover:text-primary-900 transition-colors">
        {icon}
      </div>
      <span className="truncate text-gray-700 group-hover:text-primary-900 font-medium">
        {title}
      </span>
    </div>
  );
}