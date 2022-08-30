import { Server } from "socket.io"
import { instrument } from "@socket.io/admin-ui";
import _ from "lodash"
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

type Room = {
    amount: number;
    players: Array<Player>
    ready: Array<boolean>;
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
                    val.amount--
                    let playersFiltered = val.players.filter((p: Player, idx: number) => {
                        if (!_.isEqual(p, { id: socket.id, name: usernames.get(socket.id) })) {
                            return p
                        }
                    })
                    val.players = playersFiltered
                    val.ready = [false, false]
                    rooms.set(room, val)
                    socket.to(room).emit("user-leave", val.players)
                    socket.leave(room)
                    console.log(usernames.get(socket.id), "left room", room)
                }
                else if (val !== undefined && val.amount == 0) { // if room is empty - delete
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
                room.amount++
                room.players.push({ id: id, name: username })
                rooms.set(roomID, room)
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
            rooms.set(tempID, {
                amount: 0,
                players: [],
                ready: [false, false]
            })
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
                room.ready[arrID] = !room.ready[arrID]
                rooms.set(roomID, room)
                socket.to(roomID).emit("ready", room.ready)
                callback(room.ready)
            }
        })

        /**
         * DEBUG
         */

        /**
         *  Get rooms
         */
        socket.on("get-rooms", () => {
            console.log(io.sockets.adapter.rooms)
            // io.sockets.adapter.rooms.forEach((value, key) => {
            //     console.log("val ", value)
            //     console.log("key ", key)
            //     console.log(rooms.get('a'))
            // })
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
