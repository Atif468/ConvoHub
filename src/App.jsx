// App.jsx
import { useState } from "react";
import Chats from "./components/ChatPage";
import Home from "./components/Home";
import JoinUser from "./components/JoinUser";
import { Routes, Route } from "react-router-dom";

function App() {
  // const [username, setUsername] = useState("");
  // const [isJoined, setIsJoined] = useState(false);
  // const [showLanding, setShowLanding] = useState(true);

  // const handleJoin = () => {
  //   if (username) {
  //     setIsJoined(true);
  //     setShowLanding(false);
  //   }
  // };

  return (
    //     <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white font-sans">
    //       {showLanding ? (
    //         <div className="text-center animate-fadeIn">
    //           <h1 className="text-5xl font-extrabold mb-4">Welcome to ChatApp</h1>
    //           <p className="text-lg mb-8">Connect and chat with people online.</p>
    //           <button
    //             onClick={() => setShowLanding(false)}
    //             className="px-8 py-4 text-lg font-semibold bg-red-500 hover:bg-red-600 rounded-xl transition-transform transform hover:scale-105 shadow-lg"
    //           >
    //             Enter Chat
    //           </button>
    //         </div>
    //       ) : (
    //         <div>
    //             <div className="bg-white text-black p-8 rounded-xl shadow-lg text-center animate-fadeIn">
    //               <h2 className="text-3xl font-bold mb-4">Join Chat</h2>
    //               <form onSubmit={handleJoin} className="flex flex-col gap-4">
    //                 <input
    //                   type="text"
    //                   placeholder="Enter your username"
    //                   value={username}
    //                   onChange={(e) => setUsername(e.target.value)}
    //                   className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //                 />
    //                 <button
    //                   type="submit"
    //                   className="p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
    //                 >
    //                   Join
    //                 </button>
    //               </form>
    //             </div>
    //             {isJoined ? (
    //               <Chats username={username} />
    // ) : (
    //             ""
    //           )}
    //         </div>
    //       )}
    //     </div>
    <>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/app/joinUser" element={<JoinUser />} />
        <Route path="/app/chats" element={<Chats />} />
      </Routes>
    </>
  );
}

export default App;
