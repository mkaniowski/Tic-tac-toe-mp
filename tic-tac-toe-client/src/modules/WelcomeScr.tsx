import React from "react";
import { Wrapper, Btn, JoinForm, CreateMenu, LiPlayer, Lobby } from "./WelcomeScr.style";
import { useFormik } from "formik"

const WelcomeScr = () => {

    const [menu, setMenu] = React.useState(0)
    const [username, setUsername] = React.useState("")
    const [readyP1, setReadyP1] = React.useState(false)
    let id = 123456
    let player2 = null
    // let player2 = 'player2'

    const formikJoin = useFormik({
        initialValues: {
            username: '',
            roomID: ''
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })

    const formikCreate = useFormik({
        initialValues: {
            username: ''
        },
        onSubmit: (values) => {
            console.log(values)
            setMenu(3)
            setUsername(values.username)
        }
    })

    return (
        <Wrapper>
            <h1 onClick={ () => setMenu(0) }>
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
                (<CreateMenu>
                    <label htmlFor="username">Username: </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        onChange={ formikCreate.handleChange }
                        value={ formikCreate.values.username }
                    />
                    <Btn type="submit" onClick={ () => formikCreate.handleSubmit() }>Create</Btn>
                </CreateMenu>
                ) : null
            }

            {
                menu === 3 ?
                    (<Lobby>
                        <h2>Your room id: { id }</h2>
                        <ul>
                            <LiPlayer ready={ readyP1 }>{ username }</LiPlayer>
                            { player2 ?
                                <LiPlayer ready={ false }>Player2</LiPlayer> :
                                <LiPlayer ready={ false }>Waiting for player<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
                                </LiPlayer>
                            }
                        </ul>
                        <Btn onClick={ () => setReadyP1(!readyP1) }>Ready</Btn>
                    </Lobby>
                    ) : null
            }

        </Wrapper >
    )
}

export default WelcomeScr