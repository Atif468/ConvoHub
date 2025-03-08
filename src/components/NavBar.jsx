import { BsChatHeart } from "react-icons/bs";
function NavBar() {
  return (
    <nav className=" p-4 flex justify-between items-center">
      {/* Logo Section */}
      <div className="flex items-center">
        <div className="text-center">
          <div className="flex items-center space-x-2">
            <BsChatHeart className="text-yellow-500 text-3xl" />
            <span className="text-rose-400 text-2xl font-bold">Convo Hub</span>
          </div>
          <h1 className="text-xs font-thin text-white">
            Chat Fast, Connect Easy
          </h1>
        </div>
      </div>

      {/* Links Section */}
     
     
    </nav>
  );
}

export default NavBar;
