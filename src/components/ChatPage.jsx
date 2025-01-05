import React, { useState, useEffect, useMemo, useRef } from "react";
import io from "socket.io-client";
import SideBar from "./SideBar";
import EmojiPicker from "emoji-picker-react";
import { useLocation } from "react-router-dom";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { MdOutlineClose } from "react-icons/md";
function Chats() {
  const location = useLocation(); // use to access the proped that is passes through useNavigate hook.
  const { username } = location.state || {};
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
  const InputRef = useRef(null);
  const [openEmoji, setOpen] = useState(false);
   const socket = useMemo(() => io("http://localhost:8080/"), []);

  const chatEndRef = useRef(null);
  console.log(username);

  const insertEmoji = (emojiData) => {
    const input = InputRef.current;
    if (input) {
      const start = input.selectionStart; // Where the cursor is pointing
      const end = input.selectionEnd;
  
      // Build the new input value with the emoji inserted
      const newValue =
        input.value.substring(0, start) +
        emojiData.emoji +
        input.value.substring(end);
  
      setMessage(newValue); // Update the message state
      input.value = newValue; // Update the input field value directly
  
      // Adjust the cursor position after the emoji
      input.setSelectionRange(
        start + emojiData.emoji.length,
        start + emojiData.emoji.length
      );
  
      input.focus(); // Bring the input field back into focus
    }
  };
  

  useEffect(() => {
    const storedUser = localStorage.getItem("selectedUser");
    if (storedUser) {
      setSelectedUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    socket.emit("join", username);

    users.push(username);
    if (selectedUser) {
      localStorage.setItem("selectedUser", JSON.stringify(selectedUser));
    }
    socket.on("userList", (userList) => {
      // console.log(userList); // Check what is being logged
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
          data: reader.result,
          name: selectedFile.name,
        });
      };
      reader.readAsDataURL(selectedFile);
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

  const toggleEmojiPicker = () => {
    setOpen(!openEmoji);
  };

  return (
    <div className="flex h-screen text-white w-screen overflow-x-hidden overflow-y-hidden p-2">
      <SideBar users={users} onSelectUser={(user) => setSelectedUser(user)} />
      {/* Chat Screen */}
      
      <div className="flex-1 flex flex-col lg:ml-4 p-4 rounded shadow-lg  relative transition-all duration-300">
        {/* Chat Header */}
        <div className="flex justify-between items-center mb-4">
          <h3
            className={`text-xl font-semibold ${isSidebarOpen && "opacity-50"}`}
          >
            {selectedUser
              ? `Chat with ${selectedUser.name}`
              : "Select a user to start chatting"}
          </h3>
          {typingUser && (
            <div className="text-sm text-gray-400">
              {typingUser} is typing...
            </div>
          )}
        </div>

        {/* Chat Messages */}

        <div
          className="sidebar flex-1 p-4 rounded-lg space-y-3 overflow-y-auto bg-gray-900"
        >
          {selectedUser &&
            (messages[selectedUser.name] || []).map((msg, index) => (
              <div key={index} className="p-2 w-auto">
                {msg.text && (
                  <div className="p-4 backdrop-blur-3xl border rounded-lg shadow-md mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold ">{msg.user}:</span>
                      <div
                        onClick={() => handleCopyCode(msg.text)}
                        className={`flex items-center justify-center px-3 py-2 rounded-full cursor-pointer transition-all duration-300 ${
                          isCopied
                            ? "bg-green-500 "
                            : "bg-gray-600 hover:bg-blue-500 "
                        }`}
                        title={isCopied ? "Code Copied!" : "Click to copy code"}
                      >
                        {isCopied ? "Copied" : "Copy"}
                      </div>
                    </div>
                    <pre
                      className={`p-4 rounded-lg text-sm font-mono shadow-inner ${
                        msg.user === username ? "bg-green-500" : "bg-gray-700"
                      } overflow-auto whitespace-pre-wrap`}
                    >
                      <code>{msg.text}</code>
                    </pre>
                  </div>
                )}
                {msg.file && (
                  <div className="p-4 bg-gray-800 rounded-lg shadow-md mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold ">{msg.user}:</span>
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

        {openEmoji && (
          <div className="absolute ml-4 mb-2 bottom-16 left-0 z-10">
            <EmojiPicker
              theme="dark"
              emojiStyle="facebook"
              onEmojiClick={insertEmoji}
             />
          </div>
        )}

        {/* Message Input */}
        {selectedUser && (
          <form
            onSubmit={handleSendMessage}
            className={`flex gap-1 mt-4 ${isSidebarOpen && "opacity-50"}`}
          >
            <div
              onClick={toggleEmojiPicker}
              className="text-3xl p-2 cursor-pointer"
            >
              {!openEmoji ? (
                <MdOutlineEmojiEmotions />
              ) : (<MdOutlineClose />)}
            </div>

            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
              className="p-2 bg-gray-700 rounded-md"
            >
              <option value="text">Text</option>
              <option value="file">File</option>
              <option value="code">Code</option>
            </select>

            {inputType === "text" && (
              <input
                ref={InputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleTyping}
                className="flex-1 p-2 rounded-md bg-gray-700 "
                placeholder="Type your message"
              />
            )}

            {inputType === "file" && (
              <input
                type="file"
                onChange={handleFileChange}
                className="flex-1 p-2 rounded-md bg-gray-700 "
              />
            )}

            {inputType === "code" && (
              <textarea
                 value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyPress={handleTyping}
                className="flex-1 p-2 rounded-md bg-gray-700 "
                placeholder="Write your code"
              />
            )}

            <button
              type="submit"
              className="p-2 bg-blue-500  rounded-md hover:bg-blue-600"
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
