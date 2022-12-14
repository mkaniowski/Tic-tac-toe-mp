import { Server } from "socket.io"
import { instrument } from "@socket.io/admin-ui";
import { Room } from "./room";
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
            rooms.set(tempID, new Room(tempID))
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
            room.startup()
            console.log(roomID, "preparing to start", room.signs)
            socket.to(roomID).emit("startup", room.signs[1], room.signs)
            callback([room.signs[0], room.signs])
        })

        socket.on("start", (roomID: Number, callback: Function) => {
            let room = rooms.get(roomID)
            if (room.amount === 2 && room.players.length === 2 && room.getReady) {
                console.log(roomID, "starting")
                room.start()
                callback("ok")
                room.check(socket)
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
                socket.to(roomID).emit("placed", [room.board, room.turn])
                room.clear()
            }

            let winner: String = cond(room.board)

            if (winner != '') {
                room.win(room.signs.indexOf(winner))
                socket.to(roomID).emit("winner", winner)
                room.reset()
                console.log("winner", winner)
            }

            if (room.counter === 9 && winner === '') {
                callback([room.board, room.turn, "d"])
                socket.to(roomID).emit("winner", "d")
                room.reset()
                console.log("Draw")
            }

            callback([room.board, room.turn, winner])

            room.check(socket)

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
