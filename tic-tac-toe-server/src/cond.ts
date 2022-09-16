const cond = (board: Array<Array<string>>): String => {
    // rows
    for (let i = 0; i < board.length; i++) {
        if (board[i].every((val, i, arr) => { return (val !== "" && val === arr[0]) })) {
            return board[i][0]
        }
    }

    for (let col = 0; col < board.length; col++) {
        let cols = []
        for (let row = 0; row < board.length; row++) {
            cols.push(board[row][col])
        }
        if (cols.every((val, i, arr) => { return (val !== "" && val === arr[0]) })) {
            return board[0][col]
        }
    }

    if (board[0][0] != "" && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        return board[1][1]
    }

    if (board[0][2] != "" && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        return board[1][1]
    }


    return ''
}

export default cond