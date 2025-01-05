function NavBar() {
    return (
        <nav className="bg-black p-4 flex justify-between items-center">
            {/* Logo Section */}
            <div className="flex items-center">
                <img src="path-to-your-logo.png" alt="logo" className="h-8 mr-4" />
                <span className="text-white text-xl font-semibold">ChatApp</span>
            </div>

            {/* Links Section */}
            <div className="flex space-x-6">
                <a href="#" className="text-white hover:text-gray-400">Group Chat</a>
                <a href="#" className="text-white hover:text-gray-400">Account</a>
                <a href="#" className="text-white hover:text-gray-400">Notifications</a>
                <a href="#" className="text-white hover:text-gray-400">Settings</a>
            </div>

            {/* User Profile or Logout Section (if needed) */}
            <div className="flex items-center space-x-4">
                <img src="user-profile-pic.png" alt="Profile" className="h-8 w-8 rounded-full" />
                <button className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-500">Logout</button>
            </div>
        </nav>
    );
}

export default NavBar;
