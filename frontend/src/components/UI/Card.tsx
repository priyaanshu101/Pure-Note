import { useEffect } from "react";
import type { ReactElement } from "react";
import { DeleteIcon } from "../../icons/DeleteIcon";
import { RedirectIcon } from "../../icons/Redirect";

interface CardProps {
  startIcon: ReactElement;
  title: string;
  type: "Youtube" | "Twitter" | "Instagram" | "Notes" | "Link" | "Music";
  link: string;
  onClickDelete?: () => void;
}

export const Card = (props: CardProps) => {
  const getYoutubeEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      let videoId = "";

      if (urlObj.hostname === "youtu.be") {
        videoId = urlObj.pathname.slice(1);
      } else if (
        urlObj.hostname === "www.youtube.com" ||
        urlObj.hostname === "youtube.com"
      ) {
        videoId = urlObj.searchParams.get("v") || "";
      }

      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    } catch {
      return url;
    }
  };

  useEffect(() => {
    if (props.type === "Instagram") {
      const scriptId = "instagram-embed";
      if (!document.getElementById(scriptId)) {
        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
      } else {
        window?.instgrm?.Embeds?.process?.();
      }
    }
  }, [props.type, props.link]);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-out will-change-transform overflow-hidden w-full max-w-sm mx-auto">
      {/* Card Header */}
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {props.startIcon}
          <span className="font-semibold text-gray-800 truncate">
            {props.title}
          </span>
        </div>
        
        <div className="flex gap-2 flex-shrink-0">
          <RedirectIcon size="md" />
          {props.onClickDelete && (
            <div className="hover:bg-red">
              <DeleteIcon size="md" onClick={props.onClickDelete} />
            </div>
          )}
        </div>
      </div>

      {/* Card Content */}
      {props.type === "Youtube" && (
        <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-100 mt-4">
          <iframe
            className="w-full h-full"
            src={getYoutubeEmbedUrl(props.link)}
            allowFullScreen
            title={props.title}
            loading="lazy"
          />
        </div>
      )}

      {props.type === "Twitter" && (
        <blockquote className="twitter-tweet mt-4" data-width="100%">
          <a href={props.link}></a>
        </blockquote>
      )}

      {props.type === "Instagram" && (
        <div className="w-full overflow-hidden rounded-lg mt-4">
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={props.link.split("?")[0]}
            data-instgrm-version="14"
            style={{
              background: "#FFF",
              border: 0,
              margin: 0,
              width: "100%",
              maxWidth: "100%",
            }}
          />
        </div>
      )}
    </div>
  );
};