import React, { useState, useEffect, useMemo } from "react";
import io from "socket.io-client";
import WavyBackground from "./ui/wavy-background";

function Chats({ username }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const socket = useMemo(() => io("https://chat-app-backend-jtcp.onrender.com"), []);

  useEffect(() => {
    socket.emit("join", username);

    socket.on("userList", (userList) => {
      setUsers(userList.filter((user) => user.name !== username));
    });

    socket.on("privateMessage", ({ from, text }) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [from]: [...(prevMessages[from] || []), { user: from, text }],
      }));
    });

    socket.on("typing", (user) => {
      setTypingUser(user);
      setTimeout(() => setTypingUser(null), 3000);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, username]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message && selectedUser) {
      socket.emit("privateMessage", { text: message, to: selectedUser.id });
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedUser.name]: [
          ...(prevMessages[selectedUser.name] || []),
          { user: username, text: message },
        ],
      }));
      setMessage("");
    }
  };

  const handleTyping = () => {
    if (selectedUser) {
      socket.emit("typing", selectedUser.id);
    }
  };

  return (
    <WavyBackground>
      <div className="flex h-screen w-screen relative overflow-hidden">
         <div
          className={`lg:w-1/4 w-2/3 sm:w-1/2 h-full fixed lg:relative top-0 left-0 lg:flex lg:flex-col backdrop-blur-3xl bg-transparent lg:bg-transparent p-4 shadow-2xl z-50 transition-transform transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:static overflow-y-auto`}
        >
          <h3 className="font-semibold text-lg mb-2 text-white">Online Users</h3>
          <hr />
          <ul className="list-disc list-inside space-y-1 text-white">
            {users.map((user) => (
              <li
                key={user.id}
                className={`cursor-pointer ${
                  selectedUser?.id === user.id ? "font-bold text-blue-700" : ""
                }`}
                onClick={() => {
                  setSelectedUser(user);
                  setIsSidebarOpen(false);
                }}
              >
                {user.name}
              </li>
            ))}
          </ul>
        </div>

         <div className="flex-1 flex flex-col border p-4 lg:ml-4 rounded shadow-lg overflow-hidden text-white relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              {selectedUser
                ? `Chat with ${selectedUser.name}`
                : "Select a user to start chatting"}
            </h3>
            {typingUser && (
              <div className="text-sm text-gray-400 mb-2">
                {typingUser} is typing...
              </div>
            )}
            <button
              className="lg:hidden p-2 bg-green-500 rounded text-white"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? "Close" : "Users"}
            </button>
          </div>
          <hr />

           <div className="flex-1 mb-4 p-4 rounded-lg space-y-3 overflow-y-auto">
            {selectedUser &&
              (messages[selectedUser.name] || []).map((msg, index) => (
                <pre
                  key={index}
                  className={`p-3 rounded-md shadow ${
                    msg.user === username ? "bg-blue-600" : "bg-gray-600"
                  }`}
                >
                  <strong>{msg.user}:</strong> {msg.text}
                </pre>
              ))}
          </div>

           {selectedUser && (
            <form onSubmit={handleSendMessage} className="flex gap-1">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleTyping}
                className="flex-1 p-4 bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-full 
                           focus:outline-none focus:ring-4 focus:ring-green-400 focus:border-transparent 
                           shadow-inner placeholder-gray-400 transition-all duration-200 ease-in-out"
                style={{
                  boxShadow: "inset 0 1px 4px rgba(0, 0, 0, 0.6)",
                }}
              />

              <button
                type="submit"
                className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-lg"
              >
                Send
              </button>
            </form>
          )}
        </div>
      </div>
    </WavyBackground>
  );
}

export default Chats;
