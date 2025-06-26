import { useState, useEffect } from "react";
import { CrossIcon } from "../../icons/CrossIcon";
import { Button } from "./Button";
import { CopyIcon } from "../../icons/CopyIcon";
import { CopiedIcon } from "../../icons/CopiedIcon";

export function CreateShareModal({open, onCloseShare}) {
    const [url , setUrl] = useState("None");
    const [copiedIcon, setCopiedIcon] = useState(false);

    useEffect(() => {
        if (open) {
        setUrl(window.location.href);
        }
    }, [open]);
    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopiedIcon(true);
    };

    return <div>
        {open && <div className="w-screen h-screen bg-slate-500 fixed top-0 left-0 bg-opacity-60 flex justify-center items-center" onClick={onCloseShare}>
            <div className="flex flex-col justify-between bg-white opacity-100 p-4 rounded-lg shadow-lg" onClick={(e) => {e.stopPropagation();}}>   
                <div className="flex justify-end">
                    <CrossIcon size="lg" onClick={onCloseShare}/>
                </div>
                <div className="flex justify-center text-lg pb-2">Share Brain</div>

                <div className="flex">
                    <input className="px-4 pt-2 border rounder m-2" value={url}></input>
                    <div className="flex justify-center p-3">
                        <Button startIcon={copiedIcon? <CopiedIcon size="lg"/> : <CopyIcon size="lg"/>} 
                        variant="primary" 
                        size="sm" 
                        onClick={() => {handleCopy()}} 
                        text={copiedIcon? "Copied" : "Copy"}/></div>
                </div>
            </div>   
        </div>}
    </div>
}