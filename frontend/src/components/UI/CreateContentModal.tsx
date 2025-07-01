import { useState } from "react";
import { CrossIcon } from "../../icons/CrossIcon";
import { Button } from "./Button";
import axios from "axios";
import { API_BASE } from "../../config/config";

interface CreateContentModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateContentModal({ open, onClose }: CreateContentModalProps) {
  const token = localStorage.getItem("token");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    if (!type.trim()) {
      alert(`Type is required`);
      return;
    }

    const linkRequired = !(type === "Music" || type === "Notes");
    if (linkRequired && !link.trim()) {
      alert(`Link is required for ${type}`);
      return;
    }

    const descRequired = (type === "Notes");
    if (descRequired && !description.trim()) {
      alert(`Description is required for Notes`);
      return;
    }

    try {
      const added = await axios.post(
        `${API_BASE}/content`,
        { title, link, type, description },
        { headers: { Authorization: token } }
      );

      if (added) {
        onClose();
      }
    } catch (e) {
      alert("Content cannot be added");
    }
  };

  return (
    <div>
      {open && (
        <div className="w-screen h-screen bg-slate-500 fixed top-0 left-0 bg-opacity-60 flex justify-center items-center" onClick={onClose}>
          <div className="flex flex-col justify-between bg-white opacity-100 p-4 rounded-lg shadow-lg" onClick={(e) => {e.stopPropagation();}}>
            <div className="flex justify-end">
              <CrossIcon size="lg" onClick={onClose}/>
            </div>
            <div className="flex justify-center text-lg pb-2">Add Content</div>

            <div className="flex flex-col">
              <Input
                placeholder="Title"
                value={title}
                onChange={(e:any) => setTitle(e.target.value)}
              />
              <Input
                placeholder="Link"
                value={link}
                onChange={(e:any) => setLink(e.target.value)}
              />
            <select
                className={`px-4 pt-2 border rounded m-2 pb-2 ${
                    type === "" ? "text-gray-400" : "text-black"
                }`}
                value={type}
                onChange={(e) => setType(e.target.value)}
                >
                <option value="" disabled hidden>
                    Choose a Type
                </option>
                <option value="Notes" className="text-black">Notes</option>
                <option value="Twitter" className="text-black">Twitter</option>
                <option value="Youtube" className="text-black">Youtube</option>
                <option value="Instagram" className="text-black">Instagram</option>
                <option value="Music" className="text-black">Music</option>
                <option value="Link" className="text-black">Link</option>
            </select>


            <textarea
                className="px-4 py-2 border rounded m-2 resize-y min-h-[80px]"
                placeholder={
                    type === "Notes" ? "Description" : "Description (Optional)"
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

              <div className="flex justify-center p-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSubmit}
                  text="Submit"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface InputProps{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>)=>void;
  placeholder:string;
}
function Input({ value, onChange, placeholder }:InputProps) {
  return (
    <div>
      <input
        type="text"
        className="px-4 py-2 border rounded m-2"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
