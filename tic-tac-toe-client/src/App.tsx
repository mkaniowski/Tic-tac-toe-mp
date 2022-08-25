import React, { useState } from 'react';
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
};

function App(): JSX.Element {
  const [player1, setPlayer1] = React.useState('')
  const [player2, setPlayer2] = React.useState('')
  const socket: Socket = socketClient()
  // console.log(socket)

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

    socket.on('user-join', (username: string, id: string, ...args: any) => {
      setPlayer2(username)
      console.log(username, id, ...args)
    });

    socket.on('users-room', (users: Array<any>) => {
      console.log(users[0], users[1])
      setPlayer1(users[0])
      setPlayer2(users[1])

    })

    socket.onAny((event: any, ...args: any) => {
      console.log(event, args);
    });
    return () => {
      socket.offAny();
    };
  }, []);

  return (
    <>
      <GlobalCSS />
      <WelcomeScr socket={ socket } player1={ player1 } player2={ player2 } setPlayer1={ setPlayer1 } />
    </>
  );
}

export default App;
