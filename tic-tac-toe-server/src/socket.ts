import { Server } from "socket.io"
import { instrument } from "@socket.io/admin-ui";
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

type Rooms = {

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
                socket.leave(room)
                let val = rooms.get(room)
                if (val != null && val != 1) { // if room exists and it's not empty, update player count
                    rooms.set(room, val - 1)
                }
                if (rooms.get(room) == 0) { // if room is empty - delete
                    console.log(room, "is emtpy! Deleting a room...")
                    rooms.delete(room)
                }
            })
        })

        socket.onAny((event: any, ...args: any) => {
            console.log(event, args);
        });

        /**
         * While user tries to join a room, check if the room exists and it's not full
         */
        socket.on("join-room", (id: string, username: string, roomID: number) => {
            if (usernames.get(id) == null) {
                usernames.set(id, username)
            }


            if (rooms.get(roomID) == null) { // if room does not exist
                console.log("Room", roomID, "not found!")
            } else if (rooms.get(roomID) <= 1) { // room exists and it's not full
                socket.join(roomID)
                console.log(username, id, "joined room", roomID)
                socket.to(roomID).emit("user-join", username, roomID)
            } else { // room is full
                console.log("Room", roomID, "is full!")
            }
        })

        /**
         * Creates an empty room with random roomID that does not exists
         */
        socket.on("create-room", (callback: Function) => {
            let tempID = getRandID();
            while (rooms.get(tempID) != null) {
                tempID = getRandID();
            }
            rooms.set(tempID, 0)
            callback(tempID)
            console.log("Created room", tempID)
        })

        socket.on("get-users-room", (roomID: any, username: String, callback: Function) => {
            let users: Array<any> = []
            if (io.sockets.adapter.rooms.get(roomID) != null) {
                if (username != null) { users.push(username) }
                io.sockets.adapter.rooms.get(roomID)?.forEach(user => {
                    if (usernames.get(user) != username) {
                        users.push(usernames.get(user))
                    }
                })

                console.log("users-room", users)
                callback(users)
            }

        })

        socket.on("ready", (roomID: Number, username: String) => {
            socket.to(roomID).emit("ready", username)
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

        socket.on("delete-rooms", () => {
            rooms.clear()
            console.log("Deleted all rooms")
        })
    })

}

export default socketServer
