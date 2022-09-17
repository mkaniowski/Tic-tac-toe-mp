import _ from "lodash"
type Player = {
    id: String;
    name: String;
}

export class Room {
    roomID: Number;
    amount: number;
    players: Array<Player>
    ready_: Array<boolean>
    board: Array<Array<String>>
    score: Array<number>
    turn: String
    counter: number
    signs: Array<String>
    lastDate: Date
    singlePoint: boolean
    timeoutID: any


    constructor(roomID: Number) {
        this.roomID = roomID
        this.amount = 0
        this.players = []
        this.ready_ = [false, false]
        this.board = [['', '', ''], ['', '', ''], ['', '', '']]
        this.turn = 'o'
        this.score = [0, 0]
        this.counter = 0
        this.signs = ['', '']
        this.lastDate = new Date()
        this.singlePoint = true
        this.timeoutID = undefined
    }

    join(id: String, name: String) {
        if (this.amount <= 1) {
            this.amount++
            this.players.push({ id: id, name: name })
        }
    }

    leave(id: String, name: String) {
        this.ready_ = [false, false]
        this.amount--
        this.players = this.players.filter((p: Player, idx: number) => {
            if (!_.isEqual(p, { id: id, name: name })) {
                return p
            }
        })
    }

    ready(id: String, name: String) {
        let arrID = this.players?.findIndex((ele: Player) => _.isEqual(ele, { id: id, name: name }))
        if (arrID !== undefined) {
            this.ready_[arrID] = !this.ready_[arrID]
        }
    }

    get getReady() {
        return this.ready_[0] && this.ready_[1]
    }

    place(sign: String, row: number, col: number) {
        if (this.turn === sign) {
            let diff = new Date().getTime() - this.lastDate.getTime()
            if (diff <= 10000) {
                this.board[row][col] = sign
                if (sign === 'o') { this.turn = 'x' } else { this.turn = 'o' }
                this.counter++
                this.lastDate = new Date()
            }
        }
    }

    win(idx: number) {
        if (this.singlePoint) {
            this.score[idx]++
            this.singlePoint = false
            this.reset()
        }
    }

    reset() {
        if (new Date().getTime() - this.lastDate.getTime() >= 100) {
            this.board = [['', '', ''], ['', '', ''], ['', '', '']]
            this.ready_ = [false, false]
            this.turn = 'o'
            this.counter = 0
            this.singlePoint = true
            this.lastDate = new Date()
            this.clear()
        }
    }

    get getScore() {
        return this.score
    }

    startup() {
        if (!!Math.floor(Math.random() * 2)) {
            this.signs = ['o', 'x']
        } else {
            this.signs = ['x', 'o']
        }
    }
    start() {
        this.lastDate = new Date()
    }

    check(socket: any) {
        if (this.timeoutID === undefined) {
            const idx = this.signs.findIndex((ele: String) => ele != this.turn)
            this.timeoutID = setTimeout(() => {
                this.win(idx)
                socket.emit("winner", this.signs[idx])
                socket.to(this.roomID).emit("winner", this.signs[idx])
                console.log(this.roomID, this.players[this.signs.indexOf(this.turn)], idx, "ran out of time!!!")
            }, 10000)
        }
    }

    clear() {
        clearTimeout(this.timeoutID)
        this.timeoutID = undefined
    }
}