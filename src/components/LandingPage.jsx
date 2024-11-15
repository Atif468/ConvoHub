import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white font-sans">
      <h1 className="text-5xl font-bold mb-8">Welcome to ChatApp</h1>
      <p className="text-lg mb-8">Choose a chat type to get started</p>
      
      <div className="space-y-4">
        <button
          onClick={() => navigate('/online-chat')}
          className="px-8 py-4 text-lg font-semibold bg-blue-500 hover:bg-blue-600 rounded-xl transition-transform transform hover:scale-105 shadow-lg"
        >
          Chat with Any Online User
        </button>

        <button
          onClick={() => navigate('/group-chat')}
          className="px-8 py-4 text-lg font-semibold bg-green-500 hover:bg-green-600 rounded-xl transition-transform transform hover:scale-105 shadow-lg"
        >
          Join Group Chat (Enter Group ID)
        </button>

        <button
          onClick={() => navigate('/random-chat')}
          className="px-8 py-4 text-lg font-semibold bg-purple-500 hover:bg-purple-600 rounded-xl transition-transform transform hover:scale-105 shadow-lg"
        >
          Chat with a Random Person
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
