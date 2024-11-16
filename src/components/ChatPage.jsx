import React, { useState, useEffect, useMemo } from "react";
import io from "socket.io-client";

function Chats({ username }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inputType, setInputType] = useState("text"); // 'text', 'file', 'code'
  const [file, setFile] = useState(null);
  const [code, setCode] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const socket = useMemo(() => io("http://localhost:8080/"), []);

  useEffect(() => {
    socket.emit("join", username);

    socket.on("userList", (userList) => {
      setUsers(userList.filter((user) => user.name !== username));
    });

    socket.on("privateMessage", ({ from, text, file }) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [from]: [...(prevMessages[from] || []), { user: from, text, file }],
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
    if (inputType === "text" && message && selectedUser) {
      socket.emit("privateMessage", { text: message, to: selectedUser.id });
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedUser.name]: [
          ...(prevMessages[selectedUser.name] || []),
          { user: username, text: message },
        ],
      }));
      setMessage("");
    } else if (inputType === "file" && file && selectedUser) {
      const formData = new FormData();
      formData.append("file", file);
      socket.emit("send-file", { to: selectedUser.id, file: formData });
      setFile(null);
    } else if (inputType === "code" && code && selectedUser) {
      socket.emit("privateMessage", { text: code, to: selectedUser.id });
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedUser.name]: [
          ...(prevMessages[selectedUser.name] || []),
          { user: username, text: code },
        ],
      }));
      setCode("");
    }
  };

  const handleTyping = () => {
    if (selectedUser) {
      socket.emit("typing", selectedUser.id);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text.trim()).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="flex h-screen w-screen p-2 overflow-x-hidden overflow-y-hidden">
      {/* Sidebar */}
      <div
        className={`w-1/4 h-[98%] bg-gray-800 p-4 shadow-2xl z-50 transition-transform transform ${
          isSidebarOpen
            ? "translate-x-0 backdrop-blur-3xl border-r-2"
            : "-translate-x-full"
        } lg:translate-x-0 lg:static`}
      >
        <h3 className="font-semibold text-lg mb-2 text-white">Online Users</h3>
        <ul className="list-disc list-inside space-y-1 text-white">
          {users.map((user) => (
            <li
              key={user.id}
              className={`cursor-pointer ${
                selectedUser?.id === user.id ? "font-bold text-blue-500" : ""
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

      {/* Chat Window */}
      <div className="flex-1 flex flex-col p-4 lg:ml-4 rounded shadow-lg text-white relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {selectedUser
              ? `Chat with ${selectedUser.name}`
              : "Select a user to start chatting"}
          </h3>
          {typingUser && (
            <div className="text-sm text-gray-400">
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

        <div className="flex-1 p-4 rounded-lg space-y-3 overflow-y-auto bg-gray-900">
          {selectedUser &&
            (messages[selectedUser.name] || []).map((msg, index) => (
              <div key={index} className="p-2">
                {msg.text && (
                  <div>
                    <div className="flex justify-between">
                      <strong>{msg.user}:</strong>
                      <button
                        onClick={() => handleCopyCode(msg.text)}
                        className={`mt-2 px-4 py-2 m-1 rounded ${
                          isCopied
                            ? "bg-green-500"
                            : "bg-gray-500 hover:bg-blue-600"
                        } text-white transition-all`}
                        title={isCopied ? "Copied!" : "Copy this code"}
                      >
                        {isCopied ? "Copied!" : "Copy Code"}
                      </button>
                    </div>
                    <pre
                      className={`p-3 rounded-md shadow ${
                        msg.user === username ? "bg-blue-600" : "bg-gray-700"
                      } text-white overflow-auto whitespace-pre-wrap`}
                    >
                      <code>{msg.text}</code>
                    </pre>
                  </div>
                )}
                {msg.file && (
                  <div
                    className={`p-3 rounded-md shadow ${
                      msg.user === username ? "bg-blue-600" : "bg-gray-600"
                    }`}
                  >
                    <strong>{msg.user}:</strong>
                    <a href={msg.file} className="text-blue-400" download>
                      Click to download file
                    </a>
                  </div>
                )}
              </div>
            ))}
        </div>

        {selectedUser && (
          <form onSubmit={handleSendMessage} className="flex gap-1 mt-4">
            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
              className="p-2 bg-gray-700 text-white rounded-md"
            >
              <option value="text">Text</option>
              <option value="file">File</option>
              <option value="code">Code</option>
            </select>

            {inputType === "text" && (
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleTyping}
                className="flex-1 p-4 bg-gray-700 text-white rounded-full"
              />
            )}

            {inputType === "file" && (
              <input
                type="file"
                onChange={handleFileChange}
                className="flex-1 p-4 bg-gray-700 text-white rounded-full"
              />
            )}

            {inputType === "code" && (
              <textarea
                placeholder="Write your code here..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 p-4 bg-gray-700 text-white rounded-md"
              />
            )}

            <button
              type="submit"
              className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
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
