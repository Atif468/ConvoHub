import React, { useState, useEffect, useMemo } from "react";
import io from "socket.io-client";

function Chats({ username }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [typingUser, setTypingUser] = useState(null);

  const socket = useMemo(
    () => io("https://chat-app-backend-jtcp.onrender.com/"),
    []
  );

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
    <div className="flex gap-2 p-2 animate-fadeIn h-screen w-screen">
      <div className="w-1/4 bg-gray-800 text-white p-4 rounded shadow-lg overflow-y-auto">
        <h3 className="font-semibold text-lg mb-2">Online Users</h3>
        <ul className="list-disc list-inside space-y-1">
          {users.map((user) => (
            <li
              key={user.id}
              className={`cursor-pointer ${
                selectedUser?.id === user.id ? "font-bold" : ""
              }`}
              onClick={() => setSelectedUser(user)}
            >
              {user.name}
            </li>
          ))}
        </ul>
      </div>

       <div className="flex-1 flex flex-col bg-gray-900 p-6 rounded shadow-lg">
        <h3 className="text-xl font-semibold text-white mb-4">
          <h3 className="text-xl font-semibold text-white mb-4">
            {selectedUser
              ? `Chat with ${selectedUser.name}`
              : "Select a user to start chatting"}
          </h3>
        </h3>

         <div className="flex-1 overflow-y-auto mb-4 p-4 bg-gray-800 rounded-lg space-y-3">
          {selectedUser &&
            (messages[selectedUser.name] || []).map((msg, index) => (
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

         {typingUser && (
          <div className="text-sm text-gray-400 mb-2">
            {typingUser} is typing...
          </div>
        )}

         {selectedUser && (
          <form onSubmit={handleSendMessage} className="flex">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleTyping}
              className="flex-1 p-4 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="p-4 bg-green-500 text-white rounded-r-lg hover:bg-green-600 transition-colors shadow-lg"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Chats;
