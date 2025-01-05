import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { HeroHighlight, Highlight } from "./ui/hero-highlight";
import { motion } from "framer-motion";
import NavBar from "./NavBar";

function JoinUser() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleJoin = (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError("Username is required!");
      return;
    }

    navigate("/app/chats", { state: { username } });
  };

  return (
    <>
      <NavBar />
      <HeroHighlight>
        <div className="h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [20, -5, 0] }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            className="backdrop-blur-sm border text-white p-8 rounded-xl shadow-lg w-full max-w-md"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">Join Chat</h2>
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-white m-2"
                >
                  Enter your username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 border bg-black focus:bg-black border-gray-900 text-white rounded-md focus:outline-none"
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </div>

              <button
                type="submit"
                className="px-8 w-full text-lg font-semibold rounded-xl inline-flex h-12 animate-shimmer items-center justify-center border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] text-slate-400 transition-colors focus:outline-none "
              >
                <Highlight className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                  Join
                </Highlight>
              </button>
            </form>
          </motion.div>
        </div>
      </HeroHighlight>
    </>
  );
}

export default JoinUser;
