import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

import { Card } from "../components/UI/Card";
import { NotesIcon } from "../icons/NotesIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { InstaIcon } from "../icons/InstaIcon";
import { LinkIcon } from "../icons/LinkIcon";
import { MusicIcon } from "../icons/MusicIcon";
import { Sidebar } from "../components/UI/Sidebar";

function PublicBoard() {
  const { hash } = useParams();
  const location = useLocation();
  const [contentList, setContentList] = useState([]);
  const [brainName, setBrainName] = useState(location.state?.brainName || "Anonymous");
  const [selectedType, setSelectedType] = useState("All Content");

  const fetchPublicContent = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3000/api/v1/brain/${hash}`);
      setContentList(data.content);
      if (data.brainName?.trim()) {
        setBrainName(data.brainName.trim());
      }
    } catch (error) {
      alert("Error loading public content");
    }
  };

  useEffect(() => {
    fetchPublicContent();
  }, [hash]);

  const handleSidebarSelect = (title) => {
    setSelectedType(title);
  };

  const filteredContent =
    selectedType === "All Content"
      ? contentList
      : contentList.filter((item) => item.type === selectedType);

  const getIcon = (type) => {
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
      default:
        return null;
    }
  };

  return (
    <>
      <Sidebar specificContent={handleSidebarSelect} />
      <div className="ml-60 pl-10 bg-[#faf7fe] min-h-screen pb-20 px-6 text-center relative z-10 bg-[linear-gradient(to_right,_#9ca3af,_#f1f2f4,_#9ca3af)]">
        <h2 className="text-4xl font-extrabold text-center pt-20 pb-10 text-primary-900">
          {brainName}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {filteredContent.map(
            (item) =>
              item.link && (
                <Card
                  key={item._id}
                  startIcon={getIcon(item.type)}
                  title={item.title}
                  type={item.type}
                  link={item.link}
                />
              )
          )}
        </div>
      </div>
    </>
  );
}

export default PublicBoard;
