import { useEffect, useState } from "react";
import axios from "axios";

export default function PublicVault() {
  const token = localStorage.getItem("token");
  const [contents, setContents] = useState([]);

  useEffect(() => {
    const fetchPublicContent = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/v1/brain/public", {
          headers: { Authorization: token }
        });
        setContents(data.contents);
      } catch {
        alert("Error loading Public Vault");
      }
    };

    fetchPublicContent();
  }, []);

  return (
    <div className="mt-24 px-6">
      <h2 className="text-3xl font-semibold mb-4 text-center">🔓 Public Vault</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {contents.map((item) => (
          <div key={item._id} className="border p-4 rounded shadow bg-white">
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500 mb-1">Type: {item.type}</p>
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              Open Link
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
