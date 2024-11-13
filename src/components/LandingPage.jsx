import React from "react";

export default function LandingPage({ onEnter }) {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-700 text-white font-sans animate-fadeIn">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to ChatApp</h1>
        <p className="text-lg mb-6">Connect and chat with people online.</p>
        <button
          onClick={onEnter}
          className="px-6 py-3 text-lg font-medium bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
        >
          Enter Chat
        </button>
      </div>
    </div>
  );
}
