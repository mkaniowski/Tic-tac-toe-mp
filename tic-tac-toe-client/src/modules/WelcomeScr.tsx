import React from "react";
import { Wrapper, Btn, JoinForm, CreateMenu, LiPlayer, Lobby } from "./WelcomeScr.style";
import { useFormik } from "formik"
import joinRoom from "../services/joinRoom";
import createRoom from "../services/createRoom";

const WelcomeScr = (props: any): JSX.Element => {

    const [menu, setMenu] = React.useState(0)
    const [room, setRoom] = React.useState(0)
    const [readyP1, setReadyP1] = React.useState(false)
    const [readyP2, setReadyP2] = React.useState(false)

    const formikJoin = useFormik({
        initialValues: {
            username: '',
            roomID: 0
        },
        onSubmit: (values) => {
            console.log("Submiting values (join): ", values)
            joinRoom(props.socket, values.username, values.roomID, setMenu)
            props.setPlayer1(values.username)
            setRoom(values.roomID)
            formikJoin.resetForm()
        }
    })

    const formikCreate = useFormik({
        initialValues: {
            username: ''
        },
        onSubmit: (values) => {
            console.log("Submiting values (create): ", values)
            createRoom(props.socket, values.username, setMenu, setRoom)
            props.setPlayer1(values.username)
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
                            <LiPlayer ready={ readyP1 }>{ props.player1 }</LiPlayer>
                            { props.player2 ?
                                <LiPlayer ready={ false }>{ props.player2 }</LiPlayer> :
                                <LiPlayer ready={ false }>Waiting for player<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
                                </LiPlayer>
                            }
                        </ul>
                        <Btn onClick={ () => setReadyP1(!readyP1) }>Ready</Btn>
                    </Lobby>
                    ) : null
            }
            <button onClick={ () => props.socket.emit("get-rooms") }>Get Rooms</button>
        </Wrapper >
    )
}

export default WelcomeScr