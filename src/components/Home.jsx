import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { HeroHighlight, Highlight } from "./ui/hero-highlight";
import { motion } from "framer-motion";

function Home() {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate("/app/joinUser");
  };

  return (
    <>
      <NavBar />
      <HeroHighlight>
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className=" px-4 md:text-4xl lg:text-5xl font-bold max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
        >
          <div className="flex items-center justify-center h-screen text-white font-sans">
            <div className="text-center animate-fadeIn">
              <h1 className="text-8xl font-extrabold mb-4">
                <Highlight className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                  Welcome to ChatApp
                </Highlight>
              </h1>
              <p className="text-5xl mb-8">
                Connect and chat with people online.
              </p>

              <button
                onClick={() => handleEnter()}
                className=" px-8 py-4 text-lg font-semibold rounded-xl inline-flex h-12 animate-shimmer items-center justify-center border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] text-slate-400 transition-colors focus:outline-none "
              >
                <Highlight className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                  Enter Chat
                </Highlight>
              </button>
            </div>
          </div>
        </motion.h1>
      </HeroHighlight>
    </>
  );
}
export default Home;
