import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import axios from "axios";

export default function PublicVault() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch all public brains on page load
  const fetchPublicBrains = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/v1/brain/public");
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("Error loading Public Vault");
    }
  };

  

  useEffect(() => {
    fetchPublicBrains();
  }, []);

  if (error) {
    return <div className="text-red-600 text-center mt-24">{error}</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen pt-36 pb-20 px-6 text-center bg-[linear-gradient(to_right,_#9ca3af,_#f1f2f4,_#9ca3af)]">
        <h2 className="text-4xl font-extrabold mb-10 text-primary-900">Public Vault</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 max-w-7xl mx-auto">
          {users.map((user, idx) => (
            <div
              key={idx}
              onClick={() =>
                navigate(`/brain/${user.hash}`, {
                  state: { brainName: user.brainName?.trim()}
                })
              }
              className="backdrop-blur-xl bg-primary-50 border shadow-xl rounded-3xl px-6 py-8 hover:shadow-2xl hover:bg-primary-200 hover:scale-105 cursor-pointer transition-all duration-300 transform"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {user.brainName?.trim() ? user.brainName : "Anonymous"}
              </h3>
              <p className="text-gray-600 text-sm break-all">
                Hash: {user.hash}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
