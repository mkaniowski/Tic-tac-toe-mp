import React from 'react';
import './App.css';
import socketClient from "./services/socketClient";
import WelcomeScr from "./modules/WelcomeScr";
import GlobalCSS from './global.css'
import { ToastContainer } from 'react-toastify';
import { useCountdown } from './services/useCountdown';
import 'react-toastify/dist/ReactToastify.css';

interface WelcomeScr {
  socket: object
}

type Socket = {
  disconnect?: any
  close?: any
  on?: any
  off?: any
  onAny?: any
  offAny?: any
  emit?: any
  id?: any
  auth?: any
  once?: any
};

type Player = {
  id: String;
  name: string;
}

function App(): JSX.Element {
  const [players, setPlayers] = React.useState({
    player1: '',
    player2: ''
  })
  const [ready, setReady] = React.useState([false, false])
  const [socket, setSocket]: [Socket, Function] = React.useState(socketClient)
  const [creator, setCreator] = React.useState(false)
  const [showCountdown, setShowCountdown] = React.useState(false)

  React.useEffect(() => {

    socket.on('connect', () => {
      console.log('Connected to server')
    });

    socket.on('join-room', () => {
      console.log('Joined room')
    });

    socket.on('create-room', () => {
      console.log('Created room')
    });

    socket.on('disconnect', () => {
      setPlayers({
        player1: '',
        player2: ''
      })
      setReady([false, false])
      setCreator(false)
      console.log('Disconnected from server')
    });

    socket.on('error', () => {
      console.log('error')
    });

    socket.on('user-join', (username: string, roomID: Number) => {
      setPlayers(prev => ({
        ...prev,
        player2: username
      }))
    });

    socket.on('user-leave', (playerList: Array<Player>) => {
      setPlayers({
        player1: playerList[0].name,
        player2: ''
      })
      setReady([false, false])
    });

    socket.on('ready', (readyArr: Array<boolean>) => {
      setReady(readyArr)
    })

    socket.on('startup', (sw: boolean) => {
      setShowCountdown(sw)
    })

    // socket.onAny((event: any, ...args: any) => {
    //   console.log("onAny", event, args);
    // });
    return () => {
      socket.offAny();
    };
  }, []);

  return (
    <>
      <GlobalCSS />
      <WelcomeScr socket={ socket } setPlayers={ setPlayers } players={ players } setSocket={ setSocket } ready={ ready } setReady={ setReady } setCreator={ setCreator } creator={ creator } setShowCountdown={ setShowCountdown } showCountdown={ showCountdown } />
      <ToastContainer
        position="bottom-left"
        autoClose={ 5000 }
        hideProgressBar={ false }
        newestOnTop
        closeOnClick
        rtl={ false }
        pauseOnFocusLoss={ false }
        draggable
        pauseOnHover={ false }
      />
    </>
  );
}

export default App;
