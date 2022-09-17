import { Board, Wrapper, PlayerCol, PlayerName, MidCol, SideIndicator, Circle, Cross } from "./GameBoard.style"
import { Bar } from "./ProgressBar.style"
import ProgressBar from "./ProgressBar"
import React from "react"
import EndScreen from "./EndScreen"

const GameBoard = (props: any) => {

    const [signs, setSigns] = React.useState(['', ''])
    const [winScr, setWinScr] = React.useState(false)
    const [loseScr, setLoseScr] = React.useState(false)
    const [drawScr, setDrawScr] = React.useState(false)

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

    React.useEffect(() => {
        if (props.winner === props.side) {
            setWinScr(true)
        } else if (props.winner != '' && props.winner === "d") {
            setDrawScr(true)
        } else if (props.winner != '' && props.winner != props.side) {
            setLoseScr(true)
        }

        if (props.winner != '') {
            props.socket.emit('getScore', props.room, (res: Array<number>) => props.setScore(res))
            setTimeout(() => {
                setWinScr(false)
                setLoseScr(false)
                setDrawScr(false)
                props.setWinner('')
                props.setReady([false, false])
                props.setBoard([['', '', ''], ['', '', ''], ['', '', '']])
                props.setShowCountdown(false)
                props.setMenu(3)
            }, 4000);
        }

    }, [props.winner])

    React.useEffect(() => {
        console.log(props.turn)
    }, [props.turn])

    const xoHandler = (row: number, col: number) => {
        if (props.board[row][col] == '') {
            props.socket.emit("place", props.room, props.side, [row, col], (res: Array<any>) => {
                props.setBoard(res[0])
                if ((res[1] === props.side && props.creator) || (res[1] != props.side && !props.creator)) {
                    props.setTurn([true, false])
                } else if ((res[1] === props.side && !props.creator) || (res[1] != props.side && props.creator)) {
                    props.setTurn([false, true])
                }
                props.setWinner(res[2])
            })
        }
    }

    return (
        <Wrapper>
            { winScr ? <EndScreen end={ "Win!" } /> : null }
            { loseScr ? <EndScreen end={ "Lose!" } /> : null }
            { drawScr ? <EndScreen end={ "Draw!" } /> : null }
            <PlayerCol>
                <PlayerName>{ props.players.player1 }</PlayerName>
                { props.turn[0] ? <ProgressBar /> : <Bar progress={ 100 }><div></div></Bar> }
                <SideIndicator>
                    { signs[0] == 'o' ? <Circle /> : <Cross /> }
                </SideIndicator>
            </PlayerCol>
            <MidCol>
                <span>{ props.score[0] }-{ props.score[1] }</span>
                <Board>
                    <tbody>
                        { [0, 1, 2].map(row => {
                            return <tr key={ row }>{ [0, 1, 2].map(col => {
                                return <td key={ col } onClick={ () => xoHandler(row, col) }>{ props.board[row][col] == 'o' ? <Circle /> : null }{ props.board[row][col] == 'x' ? <Cross /> : null }</td>;
                            }) }</tr>
                        }) }
                    </tbody>
                </Board >
            </MidCol>
            <PlayerCol>
                <PlayerName>{ props.players.player2 }</PlayerName>
                { props.turn[1] ? <ProgressBar /> : <Bar progress={ 100 }><div></div></Bar> }
                <SideIndicator>
                    { signs[1] == 'o' ? <Circle /> : <Cross /> }
                </SideIndicator>
            </PlayerCol>
        </Wrapper>
    )
}

export default GameBoard