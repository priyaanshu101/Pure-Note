import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { SearchComponent } from "../components/UI/SearchComponent";
import axios from "axios";

import { Card } from "../components/UI/Card";
import { NotesIcon } from "../icons/NotesIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { InstaIcon } from "../icons/InstaIcon";
import { LinkIcon } from "../icons/LinkIcon";
import { MusicIcon } from "../icons/MusicIcon";
import { Sidebar } from "../components/UI/Sidebar";
import { API_BASE } from "../config/config";
import AISearchBar from "../components/UI/AIsearch";

function PublicBoard() {
  const { hash } = useParams();
  const location = useLocation();

  const [contentList, setContentList] = useState([]);
  const [brainName, setBrainName] = useState(location.state?.brainName || "Anonymous");
  const [selectedType, setSelectedType] = useState("All Content");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchResults, setSearchResults] = useState([]); // Added this
  const [isSearchActive, setIsSearchActive] = useState(false); // Added this

  // Prevent double-fetch in dev caused by React.StrictMode
  const hasFetched = useRef(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-hide sidebar on mobile
      if (mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
      // Auto-show sidebar on desktop if it was hidden due to mobile
      if (!mobile && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const fetchPublicContent = async () => {
    try {
      const { data } = await axios.get<any>(`${API_BASE}/brain/${hash}`);
      setContentList(data.content || []);
      if (data.brainName?.trim()) {
        setBrainName(data.brainName.trim());
      }
    } catch (error) {
      alert("Error loading public content");
    }
  };

  useEffect(() => {
    if (process.env.NODE_ENV === "development" && hasFetched.current) return;

    fetchPublicContent();
    hasFetched.current = true;
  }, [hash]);

  const handleSidebarSelect = (title:string) => {
    setSelectedType(title);
    // Close sidebar on mobile after selection
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleSearchResults = (results:any) => {
    setSearchResults(results)
    setIsSearchActive(true)
  }

  // Handle search clear
  const handleClearSearch = () => {
    setSearchResults([])
    setIsSearchActive(false)
  }

  // Get the content to display based on search state
  const getDisplayContent = () => {
    if (isSearchActive && searchResults.length > 0) {
      return searchResults
    } else if (isSearchActive && searchResults.length === 0) {
      return []
    } else {
      return selectedType === "All Content"
        ? contentList
        : contentList.filter((item:any) => item.type === selectedType);
    }
  }

  const displayContent = getDisplayContent();

  const getIcon = (type:string) => {
    switch (type) {
      case "Youtube":
        return <YoutubeIcon size="md" />;
      case "Twitter":
        return <TwitterIcon size="md" />;
      case "Instagram":
        return <InstaIcon size="md" />;
      case "Notes":
        return <NotesIcon size="md" />;
      case "Link":
        return <LinkIcon size="md" />;
      case "Music":
        return <MusicIcon size="md" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-400 via-gray-100 to-gray-400 flex">
      {/* Sidebar */}
      <Sidebar
        specificContent={handleSidebarSelect}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
      />

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className={`flex-1 min-h-screen transition-all duration-300 ease-in-out ${
        !sidebarOpen ? "ml-0" : ""
      }`}>
        
        {/* Menu button - shows when sidebar is hidden */}
        {!sidebarOpen && (
          <button
            className="fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-4 sm:p-6 pt-16 sm:pt-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800">
              {isSearchActive ? 'Search Results' : brainName}
            </h1>
            <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
              {displayContent.length} items
            </span>
            {/* Search active indicator */}
            {isSearchActive && (
              <button
                onClick={handleClearSearch}
                className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 
                           px-2 py-1 rounded-full transition-colors duration-200"
              >
                Clear search
              </button>
            )}
          </div>
          
          <div className="flex gap-4">
              <SearchComponent
                onSearchResults={handleSearchResults}
                onClearSearch={handleClearSearch}
                hash={hash}
              />
              <div className='flex items-center gap-3 flex-shrink-0'>
                <AISearchBar hash={hash}/>
              </div>
          {/* Public vault indicator */}
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-2 rounded-full shadow-sm flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Public Vault
          </div>
          </div>
          
        </div>

        {/* Filter type display */}
        {selectedType !== "All Content" && !isSearchActive && (
          <div className="px-4 sm:px-6 pb-2">
            <div className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm inline-block">
              Showing: {selectedType}
            </div>
          </div>
        )}

        {/* Content grid */}
        <div className="px-4 sm:px-6 pb-6">
          {displayContent.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">No content found</div>
              <div className="text-gray-400 text-sm">
                {isSearchActive 
                  ? "No search results found. Try adjusting your search terms."
                  : selectedType === "All Content"
                    ? "This public vault is empty or content is not available."
                    : `No ${selectedType.toLowerCase()} content found in this vault.`
                }
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
              {displayContent.map(
                (item:any) =>
                  item.link && (
                    <Card
                      key={item._id.toString()}
                      startIcon={getIcon(item.type)}
                      title={item.title}
                      type={item.type}
                      link={item.link}
                      // No delete functionality for public board
                    />
                  )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PublicBoard;