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

const CardHeaderStyle = "flex items-center justify-between gap-3 pb-4";

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
    <div className="p-4 bg-white rounded-lg shadow-md border-slate-200 max-w-80 border font-semibold hover:bg-primary-200 shadow-lg hover:scale-105 transition-all duration-300 ease-out will-change-transform px-4 py-2 rounded-xl">
      <div className={`${CardHeaderStyle}`}>
        {props.startIcon} {props.title}
        <div className="flex gap-2">
          <RedirectIcon size="md" />
          {props.onClickDelete && (
            <div className="hover:bg-red">
              <DeleteIcon size="md" onClick={props.onClickDelete} />
            </div>
          )}
        </div>
      </div>

      {props.type === "Youtube" && (
        <iframe
          className="w-full rounded-lg mt-4"
          src={getYoutubeEmbedUrl(props.link)}
          allowFullScreen
          title={props.title}
        ></iframe>
      )}

      {props.type === "Twitter" && (
        <blockquote className="twitter-tweet" data-width="100%">
          <a href={`${props.link}`}></a>
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
          ></blockquote>
        </div>
      )}
    </div>
  );
};
