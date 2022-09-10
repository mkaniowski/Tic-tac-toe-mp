import { Server } from "socket.io"
import { instrument } from "@socket.io/admin-ui";
import _ from "lodash"
import cond from "./cond"
require('dotenv').config()

interface ServerToClientEvents {
    noArg: () => void;
    basicEmit: (a: number, b: string, c: Buffer) => void;
    withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
    hello: () => void;
}

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    name: string;
    age: number;
}

type Player = {
    id: String;
    name: String;
}

class Room {
    amount: number;
    players: Array<Player>
    ready_: Array<boolean>
    board: Array<Array<String>>
    score: Array<number>
    turn: String
    counter: number
    signs: Array<string>


    constructor() {
        this.amount = 0
        this.players = []
        this.ready_ = [false, false]
        this.board = [['', '', ''], ['', '', ''], ['', '', '']]
        this.turn = 'o'
        this.score = [0, 0]
        this.counter = 0
        this.signs = ['', '']
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
        console.log("leave", this.players)
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
            this.board[row][col] = sign
            if (sign === 'o') { this.turn = 'x' } else { this.turn = 'o' }
            this.counter++
        }
    }

    win(idx: number) {
        this.score[idx]++
    }

    reset() {
        this.board = [['', '', ''], ['', '', ''], ['', '', '']]
        this.ready_ = [false, false]
        this.turn = 'o'
        this.counter = 0
    }

    get getScore() {
        return this.score
    }
}


const socketServer = (httpServer: any) => {
    const rooms = new Map()
    const usernames = new Map()

    /**
     * 
     * @returns Random room ID
     */
    const getRandID = (): Number => {
        return Math.floor(100000 + Math.random() * 900000)
    }

    console.log("Initializing Socket Server...")

    const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
        cors: {
            origin: ["https://admin.socket.io", "http://localhost:3000"],
            credentials: true
        }
    })

    /**
     *  Interface to socket-io admin
     */
    instrument(io, {
        auth: {
            type: "basic",
            username: String(process.env.SOCKET_USERNAME),
            password: String(process.env.SOCKET_PASSWORD)
        },
        namespaceName: "/admin"
    });

    io.on("connection", (socket: any) => {
        console.log("User connected", socket.id, new Date())
        socket.on("disconnect", () => {
            console.log("User disconnected", socket.id, new Date())
        })

        /**
         * While user is disconnecting, server makes user to leave all joined rooms and if the rooms is empty - delete thhe room
         */
        socket.on("disconnecting", () => {
            socket.rooms.forEach((room: any) => {
                let val = rooms.get(room)
                if (val !== undefined && val.amount > 1) { // if room exists and it's not empty, update player count
                    val.leave(socket.id, usernames.get(socket.id))
                    socket.to(room).emit("user-leave", val.players)
                    socket.leave(room)
                    console.log(usernames.get(socket.id), "left room", room)
                }
                else if (val !== undefined && val.amount === 0) { // if room is empty - delete
                    console.log(room, "is emtpy! Deleting a room...")
                    rooms.delete(room)
                }
            })
        })

        /**
         * While user tries to join a room, check if the room exists and it's not full
         */
        socket.on("join-room", (id: string, username: string, roomID: number, callback: Function) => {
            if (usernames.get(id) === undefined) {
                usernames.set(id, username)
            }
            let room: Room = rooms.get(roomID)
            if (room === undefined) { // if room does not exist
                console.log("Room", roomID, "not found!")
                callback("not_found")

            } else if (room.amount <= 1) { // room exists and it's not full
                socket.join(roomID)
                console.log(username, id, "joined room", roomID)
                socket.to(roomID).emit("user-join", username, roomID)
                room.join(id, username)
                callback("ok")

            } else if (room.amount >= 2) { // room is full
                console.log("Room", roomID, "is full!")
                callback("full")

            } else {
                console.log("Room", roomID, "- unexpected error!")
                callback("error")
            }
        })

        /**
         * Creates an empty room with random roomID that does not exists
         */
        socket.on("create-room", (callback: Function) => {
            let tempID = getRandID();
            while (rooms.get(tempID) !== undefined) {
                tempID = getRandID();
            }
            rooms.set(tempID, new Room())
            callback(tempID)
            console.log("Created room", tempID)
        })

        socket.on("get-users-room", (roomID: any, username: String, callback: Function) => {
            let room = rooms.get(roomID)
            if (room !== undefined) {
                callback(room.players)
            }

        })

        socket.on("ready", (roomID: Number, callback: Function) => {
            let room = rooms.get(roomID)
            let arrID = room.players.findIndex((ele: Player) => _.isEqual(ele, { id: socket.id, name: usernames.get(socket.id) }))
            if (arrID !== undefined) {
                room.ready(socket.id, usernames.get(socket.id))
                socket.to(roomID).emit("ready", room.ready_)
                callback(room.ready_)
            }
        })

        socket.on("startup", (roomID: Number, callback: Function) => {
            let room = rooms.get(roomID)
            let side = Math.floor(Math.random() * 2)
            if (!!side) {
                room.signs = ['o', 'x']
            } else {
                room.signs = ['x', 'o']
            }
            console.log(roomID, "preparing to start", !!side)
            socket.to(roomID).emit("startup", room.getReady, !side)
            callback([room.getReady, !!side])
        })

        socket.on("start", (roomID: Number, callback: Function) => {
            let room = rooms.get(roomID)
            if (room.amount === 2 && room.players.length === 2 && room.getReady) {
                console.log(roomID, "starting")
                callback("ok")
            } else {
                console.log(roomID, socket.id, "ERROR", room.amount === 2, room.players.length === 2, room.getReady)
                callback(["error", room])
            }
        })

        socket.on("place", (roomID: Number, side: String, cords: Array<number>, callback: Function) => {
            let room = rooms.get(roomID)
            let col: number, row: number
            [col, row] = cords
            if (room.board[col][row] === '') {
                room.place(side, col, row)
                // callback([room.board, room.turn])
                socket.to(roomID).emit("placed", [room.board, room.turn])
                // console.log(roomID, side, cords)
            }

            if (room.counter === 9) {
                callback([room.board, room.turn, "d"])
                socket.to(roomID).emit("winner", "d")
                room.reset()
                console.log("Draw")
            }

            let check = cond(room.board)

            if (check[0]) {
                room.win(room.signs.indexOf(check[1]))
                socket.to(roomID).emit("winner", check[1])
                room.reset()
                console.log("winner", check[1])
            }

            callback([room.board, room.turn, check[1]])

        })

        socket.on("getScore", (roomID: number, callback: Function) => {
            let room = rooms.get(roomID)
            callback(room.getScore)
        })

        /**
         * DEBUG
         */

        /**
         *  Get rooms
         */
        socket.on("get-rooms", () => {
            console.log(io.sockets.adapter.rooms)
        })

        socket.on("get-rooms-obj", (callback: Function) => {
            console.log(rooms)
            callback(Array.from(rooms))
        })

        socket.on("delete-rooms", () => {
            rooms.clear()
            console.log("Deleted all rooms")
        })
    })

}

export default socketServer
