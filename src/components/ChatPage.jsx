import React, { useState, useEffect, useMemo } from "react";
import io from "socket.io-client";

function Chats({ username }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const socket = useMemo(() => io("https://chat-app-backend-jtcp.onrender.com/"), []);

  useEffect(() => {
    // Join the chat with username
    socket.emit("join", username);

    // Listen for incoming messages
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Listen for the updated list of users
    socket.on("userList", (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, username]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("message", { text: message, user: username });
      setMessage("");
    }
  };

  return (
    <div className="flex gap-2 p-2 animate-fadeIn h-screen w-screen">
      {/* Users List */}
      <div className="w-1/4 bg-gray-800 text-white p-4 rounded shadow-lg overflow-y-auto">
        <h3 className="font-semibold text-lg mb-2">Online Users</h3>
        <ul className="list-disc list-inside space-y-1">
          {users.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </div>

      {/* Chat Messages and Input */}
      <div className="flex-1 flex flex-col bg-gray-900 p-6 rounded shadow-lg">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-800 rounded-lg space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-md shadow ${
                msg.user === username ? "bg-blue-600" : "bg-gray-600"
              }`}
            >
              <strong>{msg.user}:</strong> {msg.text}
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-4 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="p-4 bg-green-500 text-white rounded-r-lg hover:bg-green-600 transition-colors shadow-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chats;
