import React, { useState } from 'react';
import './App.css';
import socketClient from "./services/socketClient";
import WelcomeScr from "./modules/WelcomeScr";
import GlobalCSS from './global.css'
import { ToastContainer } from 'react-toastify';
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
    const [players, setPlayers] = useState({
        player1: '',
        player2: ''
    })
    const [ready, setReady] = useState([false, false])
    const [socket, setSocket]: [Socket, Function] = useState(socketClient)
    const [creator, setCreator] = React.useState(false)
    const [showCountdown, setShowCountdown] = useState(false)
    const [turn, setTurn] = useState([false, false])
    const [side, setSide] = useState("")
    const [board, setBoard] = useState([['', '', ''], ['', '', ''], ['', '', '']])
    const [winner, setWinner] = useState('')
    const [score, setScore] = useState([0, 0])
    const [signs, setSigns] = useState(['', ''])

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
            setShowCountdown(false)
            setBoard([['', '', ''], ['', '', ''], ['', '', '']])
            console.log('Disconnected from server')
        });

        socket.on('error', () => {
            console.log('error')
        });

        socket.on('user-join', (username: string) => {
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
            setShowCountdown(false)
        });

        socket.on('ready', (readyArr: Array<boolean>) => {
            setReady(readyArr)
        })

        socket.on('startup', (side_: string, signs_: Array<string>) => {
            setShowCountdown(true)
            setSide(side_)
            setSigns(signs_)
            setTurn([signs_[0] === 'o', signs_[1] === 'o'])
            console.log([side_ === signs_[0], side_ === signs_[1]], side_, signs_)
        })

        socket.on('winner', (sign: string) => {
            setWinner(sign)
            setTurn([false, false])
        })

        socket.on("placed", (res: any) => {
            console.log("call", res[1])
            setBoard(res[0])
            setTurn([res[1] === signs[0], res[1] === signs[1]])
        })

        socket.on("tst", (res: any) => {
            console.log("tst", res)
        })

        // socket.onAny((event: any, ...args: any) => {
        //   console.log("onAny", event, args);
        // });
        return () => {
            socket.offAny();
        };
    }, [signs]);

    return (
        <>
            <GlobalCSS />
            <WelcomeScr socket={ socket } setPlayers={ setPlayers } players={ players } setSocket={ setSocket } ready={ ready } setReady={ setReady } setCreator={ setCreator } creator={ creator } setShowCountdown={ setShowCountdown } showCountdown={ showCountdown } setTurn={ setTurn } turn={ turn } board={ board } setBoard={ setBoard } side={ side } setSide={ setSide } winner={ winner } setWinner={ setWinner } score={ score } setSigns={ setSigns } setScore={ setScore } />
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
