import React, { useState } from "react";

function SideBar({ users, onSelectUser }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsSidebarOpen(false);
    onSelectUser(user);
  };
console.log(users);

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        className={`lg:hidden fixed right-10 top-5 p-2 h-10 z-50 cursor-pointer bg-green-500 rounded text-white ${
          isSidebarOpen ? "hidden" : ""
        }`}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? "Close" : "Select users"}
      </button>

      {/* Sidebar Panel */}
      <div
        className={`fixed lg:static rounded-l-lg z-50 backdrop-blur-3xl lg:bg-neutral-800 w-[60%] lg:w-1/4 h-[98%] p-4 shadow-2xl transition-transform transform ${
          isSidebarOpen ? "translate-x-1" : "-translate-x-[110%] "
        } lg:translate-x-0`}
      >
        <div className="flex justify-between">
          <h3 className="font-semibold text-lg mb-2 text-white">
            Online Users
          </h3>
          <button
            className={`text-lg mb-2 ${isSidebarOpen ? "" : "hidden"}`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} // Corrected here
          >
            x
          </button>
        </div>
        <hr />
        <ul className="list-disc list-inside space-y-1 text-white">
          {users.map((user) => (
            <li
              key={user.id}
              className={`cursor-pointer ${
                selectedUser?.id === user.id ? "font-bold text-blue-500" : ""
              }`}
              onClick={() => handleUserClick(user)}
            >
              {user.name}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default SideBar;
