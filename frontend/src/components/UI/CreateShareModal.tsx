import { useState, useEffect } from "react"
import axios from "axios"
import { CrossIcon } from "../../icons/CrossIcon"
import { Button } from "./Button"
import { CopyIcon } from "../../icons/CopyIcon"
import { CopiedIcon } from "../../icons/CopiedIcon"

export function CreateShareModal({ open, type, onCloseShare, onUpdateType, existingHash }) {
  const token = localStorage.getItem("token")
  const [url, setUrl] = useState("None")
  const [copiedIcon, setCopiedIcon] = useState(false)
  const [brainType, setBrainType] = useState(type)
  const [brainName, setBrainName] = useState("")

  useEffect(() => {
    if (type === "public" && existingHash) {
      setUrl(`http://localhost:3000/brain/${existingHash}`)
    }
    setBrainType(type)
  }, []) 

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopiedIcon(true)
  }

  const shareBrain = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/v1/brain/share",
        { brainName },
        {
          headers: { Authorization: token }
        }
      )
      console.log(data.hash);
      const shareURL = `http://localhost:3000/brain/${data.hash}`
      setUrl(shareURL)
      setBrainType("public")
      setCopiedIcon(false)
      onUpdateType("public")
    } catch (error) {
      console.error("Share failed", error)
    }
  }

  const unShareBrain = async () => {
    try {
      await axios.delete("http://localhost:3000/api/v1/brain/unshare", {
        headers: { Authorization: token }
      })
      setBrainType("private")
      setUrl("")
      setCopiedIcon(false)
      onUpdateType("private")
    } catch (error) {
      console.error("Unshare failed", error)
    }
  }

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
                    className="px-4 pt-2 border rounded m-2"
                    value={url}
                    readOnly
                  />
                  <div className="flex justify-center p-3">
                    <Button
                      startIcon={copiedIcon ? <CopiedIcon size="lg" /> : <CopyIcon size="lg" />}
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
              <div>
                <div className="flex justify-center pb-3">
                  <input
                    className="px-4 pt-2 border rounded m-2"
                    placeholder="Enter Brain Name"
                    value={brainName}
                    onChange={(e) => setBrainName(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-center">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={shareBrain}
                    text={"Share Brain"}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
