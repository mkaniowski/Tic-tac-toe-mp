import { Board, Wrapper, PlayerCol, PlayerName, MidCol, SideIndicator, Circle, Cross } from "./GameBoard.style"
import { Bar } from "./ProgressBar.style"
import ProgressBar from "./ProgressBar"
import { useCountdown } from "../services/useCountdown"
import React from "react"

const GameBoard = (props: any) => {

    const [sw1, setSw1] = React.useState(false)
    const [sw2, setSw2] = React.useState(false)

    const Rows = () => {
        for (var row = 0; row < 3; row++) {
            return (<tr>
                { ['a', 'b', 'c'].map(element => {
                    return <td key={ element }>{ element }</td>;
                }) }
            </tr>)

        }
    }


    return (
        <Wrapper>
            <PlayerCol>
                <PlayerName>{ props.players.player1 }</PlayerName>
                { sw1 ? <ProgressBar /> : <Bar progress={ 100 }><div></div></Bar> }
                {/* <ProgressBar progress={ useCountdown(10000) * 10 } /> */ }
                {/* <button onClick={ () => setSw1(!sw1) }>ON</button> */ }
                <SideIndicator><Circle /></SideIndicator>
            </PlayerCol>
            <MidCol>
                <span>6-1</span>
                <Board>
                    <tbody>
                        { ['1', '2', '3'].map(row => {
                            return <tr key={ row }>{ ['a', 'b', 'c'].map(col => {
                                return <td key={ col } onClick={ () => console.log(row, col) }>{ [row, col] }</td>;
                            }) }</tr>;
                        }) }
                    </tbody>
                </Board >
            </MidCol>
            <PlayerCol>
                <PlayerName>{ props.players.player2 }</PlayerName>
                { sw2 ? <ProgressBar /> : <Bar progress={ 100 }><div></div></Bar> }
                {/* <button onClick={ () => setSw2(!sw2) }>ON</button> */ }
                <SideIndicator><Cross /></SideIndicator>
            </PlayerCol>
        </Wrapper>
    )
}

export default GameBoard