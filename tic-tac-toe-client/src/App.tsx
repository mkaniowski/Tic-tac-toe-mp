import React, { useState } from 'react';
import './App.css';
import socketClient from "./services/socketClient";
import WelcomeScr from "./modules/WelcomeScr";

function App() {
    const [con, setCon] = useState(false)
    const socket = socketClient(setCon)

  return (
    <WelcomeScr/>
  );
}

export default App;
