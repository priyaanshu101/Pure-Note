// import { useState, useEffect } from "react";
// import { CrossIcon } from "../../icons/CrossIcon";
// import { Button } from "./Button";
// import { CopyIcon } from "../../icons/CopyIcon";
// import { CopiedIcon } from "../../icons/CopiedIcon";

// export function CreateShareModal({open, type, onCloseShare}) {
//   const token = localStorage.getItem('token');
//     const [url , setUrl] = useState("None");
//     const [copiedIcon, setCopiedIcon] = useState(false);
//     const [brainType, setBrainType] = useState(type);

//     useEffect(() => {
//         if (open) {
//         setUrl(window.location.href);
//         }
//     }, [open]);
//     const handleCopy = () => {
//         navigator.clipboard.writeText(url);
//         setCopiedIcon(true);
//     };

//     const shareBrain = async() => {
//         try{
//             const { data } = await axios.post('http://localhost:3000/api/v1/shareBrain', {
//             headers: { Authorization: token }
//           })
//         }
//     }

//     const unShareBrain = async() => {
//         try{
//             const { data } = await axios.delete('http://localhost:3000/api/v1/deleteBrain', {
//             headers: { Authorization: token }
//           })
//         }
//     }

//     return <div>
//         {open && <div className="w-screen h-screen bg-slate-500 fixed top-0 left-0 bg-opacity-60 flex justify-center items-center" onClick={onCloseShare}>
//             <div className="flex flex-col justify-between bg-white opacity-100 p-4 rounded-lg shadow-lg" onClick={(e) => {e.stopPropagation();}}>   
//                 <div className="flex justify-end">
//                     <CrossIcon size="lg" onClick={onCloseShare}/>
//                 </div>
//                   {/* conditional render according to type */}
//                   {brainType === "public" && (
//                     <div>
//                       <div className="flex justify-center text-lg pb-2">Share Brain</div>

//                       <div className="flex">
//                           <input className="px-4 pt-2 border rounder m-2" value={url}></input>
//                           <div className="flex justify-center p-3">
//                               <Button startIcon={copiedIcon? <CopiedIcon size="lg"/> : <CopyIcon size="lg"/>} 
//                               variant="primary" 
//                               size="sm" 
//                               onClick={() => {handleCopy()}} 
//                               text={copiedIcon? "Copied" : "Copy"}/>
//                           </div>
//                       </div>

//                       <div className="flex items-center justify-center">
//                         <Button 
//                           variant="primary" 
//                           size="sm" 
//                           onClick={() => {unShareBrain()}} 
//                           text={"Unshare Brain"}/>
//                       </div>

//                     </div>
//                   )}
                  
//                   {brainType === "private" && (
//                     <div>
//                       <Button
//                       variant="primary" 
//                       size="sm" 
//                       onClick={() => {unShareBrain()}} 
//                       text={"Share Brain"}/>
//                     </div>
//                   )}

//                 </div>
                
//             </div>   
//         </div>}
//     </div>
// }

import { useState, useEffect } from "react";
import axios from "axios";
import { CrossIcon } from "../../icons/CrossIcon";
import { Button } from "./Button";
import { CopyIcon } from "../../icons/CopyIcon";
import { CopiedIcon } from "../../icons/CopiedIcon";

export function CreateShareModal({ open, type, onCloseShare }) {
  const token = localStorage.getItem("token");
  const [url, setUrl] = useState("None");
  const [copiedIcon, setCopiedIcon] = useState(false);
  const [brainType, setBrainType] = useState(type);

  useEffect(() => {
    if (open) {
      setUrl(window.location.href);
    }
  }, [open]);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopiedIcon(true);
  };

  const shareBrain = async () => {
    try {
      await axios.post(
        "http://localhost:3000/api/v1/brain/share",
        {},
        {
          headers: { Authorization: token },
        }
      );
      setBrainType("public");
    } catch (error) {
      console.error("Share failed", error);
    }
  };

  const unShareBrain = async () => {
    try {
      await axios.delete("http://localhost:3000/api/v1/brain/unshare", {
        headers: { Authorization: token },
      });
      setBrainType("private");
    } catch (error) {
      console.error("Unshare failed", error);
    }
  };

  return (
    <div>
      {open && (
        <div
          className="w-screen h-screen bg-slate-500 fixed top-0 left-0 bg-opacity-60 flex justify-center items-center"
          onClick={onCloseShare}
        >
          <div
            className="flex flex-col justify-between bg-white opacity-100 p-4 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end">
              <CrossIcon size="lg" onClick={onCloseShare} />
            </div>

            {brainType === "public" && (
              <div>
                <div className="flex justify-center text-lg pb-2">Share Brain</div>

                <div className="flex">
                  <input
                    className="px-4 pt-2 border rounder m-2"
                    value={url}
                    readOnly
                  />
                  <div className="flex justify-center p-3">
                    <Button
                      startIcon={
                        copiedIcon ? <CopiedIcon size="lg" /> : <CopyIcon size="lg" />
                      }
                      variant="primary"
                      size="sm"
                      onClick={handleCopy}
                      text={copiedIcon ? "Copied" : "Copy"}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={unShareBrain}
                    text={"Unshare Brain"}
                  />
                </div>
              </div>
            )}

            {brainType === "private" && (
              <div className="flex items-center justify-center">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={shareBrain}
                  text={"Share Brain"}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
