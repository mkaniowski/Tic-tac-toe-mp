import { Board, Wrapper, PlayerCol, PlayerName, MidCol, SideIndicator, Circle, Cross } from "./GameBoard.style"
import { Bar } from "./ProgressBar.style"
import ProgressBar from "./ProgressBar"
import React from "react"

const GameBoard = (props: any) => {

    const [sw1, setSw1] = React.useState(false)
    const [sw2, setSw2] = React.useState(false)
    const [signs, setSigns] = React.useState(['', ''])

    React.useEffect(() => {
        if (props.creator === true) {
            if (props.side == 'o') {
                setSigns(['o', 'x'])
            } else {
                setSigns(['x', 'o'])
            }
        } else {
            if (props.side == 'o') {
                setSigns(['x', 'o'])
            } else {
                setSigns(['o', 'x'])
            }
        }
    }, [])

    const xoHandler = (row: number, col: number) => {
        console.log(props.side, "try to place", row, col)
        if (props.board[row][col] == '') {
            // let cpy = [...props.board]
            // cpy[row][col] = props.side
            // cpy[row][col] = 'x'
            // props.setBoard(cpy)
            props.socket.emit("place", props.room, props.side, [row, col], (res: Array<any>) => {
                props.setBoard(res[0])
                if (res[1] == props.side) {
                    props.setTurn(true)
                } else {
                    props.setTurn(false)
                }
                console.log(res)
            })
            // console.log(props.board)
        }
    }

    return (
        <Wrapper>
            <PlayerCol>
                <PlayerName>{ props.players.player1 }</PlayerName>
                { sw1 ? <ProgressBar /> : <Bar progress={ 100 }><div></div></Bar> }
                {/* <button onClick={ () => setSw1(!sw1) }>ON</button> */ }
                <SideIndicator>
                    { signs[0] == 'o' ? <Circle /> : <Cross /> }
                </SideIndicator>
            </PlayerCol>
            <MidCol>
                <span>6-1</span>
                <Board>
                    <tbody>
                        { [0, 1, 2].map(row => {
                            return <tr key={ row }>{ [0, 1, 2].map(col => {
                                return <td key={ col } onClick={ () => xoHandler(row, col) }>{ props.board[row][col] == 'o' ? <Circle /> : null }{ props.board[row][col] == 'x' ? <Cross /> : null }</td>;
                            }) }</tr>;
                        }) }
                    </tbody>
                </Board >
            </MidCol>
            <PlayerCol>
                <PlayerName>{ props.players.player2 }</PlayerName>
                { sw2 ? <ProgressBar /> : <Bar progress={ 100 }><div></div></Bar> }
                {/* <button onClick={ () => setSw2(!sw2) }>ON</button> */ }
                <SideIndicator>
                    { signs[1] == 'o' ? <Circle /> : <Cross /> }
                </SideIndicator>
            </PlayerCol>
        </Wrapper>
    )
}

export default GameBoard