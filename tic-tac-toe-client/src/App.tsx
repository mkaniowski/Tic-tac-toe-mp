import React from 'react';
import './App.css';
import socketClient from "./services/socketClient";
import WelcomeScr from "./modules/WelcomeScr";
import GlobalCSS from './global.css'

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

function App(): JSX.Element {
  const [player1, setPlayer1] = React.useState('')
  const [player2, setPlayer2] = React.useState('')
  const [players, setPlayers] = React.useState({
    player1: '',
    player2: ''
  })
  const [readyP1, setReadyP1] = React.useState(false)
  const [readyP2, setReadyP2] = React.useState(false)
  const [socket, setSocket]: [Socket, Function] = React.useState(socketClient)
  const counter = React.useRef(0);

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

    socket.on('users-room', (users: Array<any>) => {
      console.log(users[0], users[1])
      setPlayer1(users[0])
      setPlayer2(users[1])
    })

    socket.on('ready', (user: String) => {
      counter.current++ // socket emits twice the same event so I had to "cut it in half"
      if (counter.current % 2 == 0) {
        setReadyP2(current => !current)
      }
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
      <WelcomeScr socket={ socket } player1={ player1 } player2={ player2 } setPlayer1={ setPlayer1 } readyP1={ readyP1 } readyP2={ readyP2 } setReadyP1={ setReadyP1 } setReadyP2={ setReadyP2 } setPlayers={ setPlayers } players={ players } setSocket={ setSocket } />
    </>
  );
}

export default App;
