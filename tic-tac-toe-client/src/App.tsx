import React, { useState } from 'react';
import './App.css';
import socketClient from "./services/socketClient";
import WelcomeScr from "./modules/WelcomeScr";
import GlobalCSS from './global.css'

function App() {
  const [con, setCon] = useState(false)
  const socket = socketClient(setCon)

  return (
    <>
      <GlobalCSS />
      <WelcomeScr />
    </>
  );
}

export default App;
