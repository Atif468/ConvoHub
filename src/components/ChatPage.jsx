import React, { useState, useEffect, useMemo, useRef } from "react";
import io from "socket.io-client";

function Chats({ username }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inputType, setInputType] = useState("text");
  const [file, setFile] = useState(null);
  const [code, setCode] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const socket = useMemo(() => io("https://chat-app-backend-jtcp.onrender.com"), []);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.emit("join", username);

    socket.on("userList", (userList) => {
      setUsers(userList.filter((user) => user.name !== username));
    });

    socket.on("privateMessage", ({ from, text, file, fileName }) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [from]: [
          ...(prevMessages[from] || []),
          { user: from, text, file, fileName },
        ],
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

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedUser]);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile({
          data: reader.result, // Base64 data
          name: selectedFile.name,
        });
      };
      reader.readAsDataURL(selectedFile); // Read file as base64
    }
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();

    if (inputType === "file" && file && selectedUser) {
      socket.emit("send-file", {
        to: selectedUser.id,
        from: username,
        file: file.data,
        filename: file.name,
      });

      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedUser.name]: [
          ...(prevMessages[selectedUser.name] || []),
          { user: username, file: file.data, filename: file.name },
        ],
      }));
      setFile(null);
    }

    if (inputType === "text" && message.trim() && selectedUser) {
      socket.emit("privateMessage", {
        to: selectedUser.id,
        from: username,
        text: message.trim(),
      });

      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedUser.name]: [
          ...(prevMessages[selectedUser.name] || []),
          { user: username, text: message.trim() },
        ],
      }));
      setMessage("");
    }

    if (inputType === "code" && code.trim() && selectedUser) {
      socket.emit("privateMessage", {
        to: selectedUser.id,
        from: username,
        text: code.trim(),
      });

      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedUser.name]: [
          ...(prevMessages[selectedUser.name] || []),
          { user: username, text: code.trim() },
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

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text.trim()).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="flex h-screen w-screen p-2 overflow-x-hidden overflow-y-hidden">
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

        <div className="sidebar flex-1 p-4 rounded-lg space-y-3 overflow-y-auto bg-gray-900">
          {selectedUser &&
            (messages[selectedUser.name] || []).map((msg, index) => (
              <div key={index} className="p-2">
                {msg.text && (
                  <div className="p-4 bg-gray-800 rounded-lg shadow-md mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-200">
                        {msg.user}:
                      </span>
                      <div
                        onClick={() => handleCopyCode(msg.text)}
                        className={`flex items-center justify-center px-3 py-2 rounded-full cursor-pointer transition-all duration-300 ${
                          isCopied
                            ? "bg-green-500 text-white"
                            : "bg-gray-600 hover:bg-blue-500 text-gray-200"
                        }`}
                        title={isCopied ? "Code Copied!" : "Click to copy code"}
                      >
                        {isCopied ? "Copied" : "Copy"}
                      </div>
                    </div>
                    <pre
                      className={`p-4 rounded-lg text-sm font-mono shadow-inner ${
                        msg.user === username ? "bg-blue-700" : "bg-gray-700"
                      } text-gray-100 overflow-auto whitespace-pre-wrap`}
                    >
                      <code>{msg.text}</code>
                    </pre>
                  </div>
                )}
                {msg.file && (
                  <div className="p-4 bg-gray-800 rounded-lg shadow-md mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-200">
                        {msg.user}:
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <a
                        href={msg.file}
                        download
                        className="text-blue-500 hover:underline"
                      >
                        Download {msg.fileName}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          <div ref={chatEndRef} />
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
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleTyping}
                className="flex-1 p-2 rounded-md bg-gray-700 text-white"
                placeholder="Type your message"
              />
            )}

            {inputType === "file" && (
              <input
                type="file"
                onChange={handleFileChange}
                className="flex-1 p-2 rounded-md bg-gray-700 text-white"
              />
            )}

            {inputType === "code" && (
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyPress={handleTyping}
                className="flex-1 p-2 rounded-md bg-gray-700 text-white"
                placeholder="Write your code"
              />
            )}

            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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
