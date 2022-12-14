import React from "react";
import { Wrapper, Btn, JoinForm, CreateMenu, LiPlayer, Lobby } from "./WelcomeScr.style";
import { useFormik } from "formik"
import joinRoom from "../services/joinRoom";
import createRoom from "../services/createRoom";
import Countdown from "./Countdown";
import GameBoard from "./GameBoard";

const WelcomeScr = (props: any): JSX.Element => {

    const [menu, setMenu] = React.useState(0)
    const [room, setRoom] = React.useState(0)

    const formikJoin = useFormik({
        initialValues: {
            username: '',
            roomID: 0
        },
        onSubmit: (values) => {
            joinRoom(props.socket, values.username, values.roomID, setMenu, props.setPlayers, props.setSocket)
            setRoom(values.roomID)
            formikJoin.resetForm()
        }
    })

    const formikCreate = useFormik({
        initialValues: {
            username: ''
        },
        onSubmit: (values) => {
            createRoom(props.socket, values.username, setMenu, setRoom, props.setSocket, props.setCreator)
            props.setPlayers((prev: any) => ({
                ...prev,
                player1: values.username
            }))
            formikCreate.resetForm()
        }
    })

    return (
        <Wrapper>
            <h1 onClick={ () => { setMenu(0); props.socket.disconnect() } }>
                Tic-tac-toe
            </h1>
            { menu === 0 ?
                (<div>
                    <Btn onClick={ () => setMenu(1) }>Join game</Btn>
                    <Btn onClick={ () => setMenu(2) }>Create game</Btn>
                </div>
                ) : null }

            { menu === 1 ?
                (<JoinForm onSubmit={ formikJoin.handleSubmit }>
                    <label htmlFor="username">Username: </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        onChange={ formikJoin.handleChange }
                        value={ formikJoin.values.username }
                    />
                    <label htmlFor="roomID">Room ID: </label>
                    <input
                        id="roomID"
                        name="roomID"
                        type="number"
                        onChange={ formikJoin.handleChange }
                        value={ formikJoin.values.roomID }
                    />
                    <Btn type="submit">Join</Btn>
                </JoinForm>
                ) : null }

            { menu === 2 ?
                (<CreateMenu onSubmit={ formikCreate.handleSubmit }>
                    <label htmlFor="username">Username: </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        onChange={ formikCreate.handleChange }
                        value={ formikCreate.values.username }
                    />
                    <Btn type="submit">Create</Btn>
                </CreateMenu>
                ) : null
            }

            {
                menu === 3 ?
                    (<Lobby>
                        <h2>Your room id: { room }</h2>
                        <ul>
                            <LiPlayer ready={ props.ready[0] }>{ props.players.player1 }</LiPlayer>
                            { props.players.player2 ?
                                <LiPlayer ready={ props.ready[1] }>{ props.players.player2 }</LiPlayer> :
                                <LiPlayer ready={ false }>Waiting for player<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
                                </LiPlayer>
                            }
                        </ul>
                        { props.showCountdown ? <Countdown socket={ props.socket } room={ room } ready={ props.ready } setMenu={ setMenu } /> :
                            <span><Btn onClick={ () => {
                                props.socket.emit("ready", room, (res: Array<boolean>) => {
                                    props.setReady(res)
                                })
                            } }>Ready</Btn>
                                { props.ready[0] && props.ready[1] && props.creator ?
                                    <Btn onClick={ () => {
                                        props.socket.emit("startup", room, (res: any) => {
                                            props.setShowCountdown(true)
                                            props.setSide(res[0])
                                            props.setSigns(res[1])
                                            props.setTurn([res[1][0] === 'o', res[1][1] === 'o'])
                                        })
                                    } }>Start</Btn>
                                    : null }</span> }
                    </Lobby>
                    ) : null
            }
            {
                menu === 4 ? (<GameBoard socket={ props.socket } room={ room } turn={ props.turn } setTurn={ props.setTurn } setMenu={ setMenu } players={ props.players } board={ props.board } setBoard={ props.setBoard } side={ props.side } creator={ props.creator } winner={ props.winner } setWinner={ props.setWinner } score={ props.score } setScore={ props.setScore } setReady={ props.setReady } setShowCountdown={ props.setShowCountdown } />) : null
            }
        </Wrapper >
    )
}

export default WelcomeScr