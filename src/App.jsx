// App.jsx
import { useState } from "react";
import Chats from "./components/ChatPage";
import Home from "./components/Home1";
import JoinUser from "./components/JoinUser";
import { Routes, Route } from "react-router-dom";



function App() {
  return (
   <>
   {/* <LogtoProvider config={config}> */}
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/app/joinUser" element={<JoinUser />} />
        <Route path="/app/secureChats" element={<Chats />} />
      </Routes>
      {/* </LogtoProvider> */}
    </>
  );
}

export default App;
