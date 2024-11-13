import React, { useState } from "react";

export default function UsernamePage({ onUsernameSubmit }) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username) {
      localStorage.setItem("username", username); // Save username
      onUsernameSubmit(username);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white text-black animate-fadeIn">
      <div className="p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold mb-4">Enter Your Username</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Join
          </button>
        </form>
      </div>
    </div>
  );
}
