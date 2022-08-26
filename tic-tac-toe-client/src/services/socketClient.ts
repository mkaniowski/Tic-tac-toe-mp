import { io } from "socket.io-client";

const socketClient = (): object => {
    const socket = io("http://localhost:3001", { autoConnect: false })
    socket.on("connect", () => {
        console.log("User connected (socket) ", socket.id, new Date());

        socket.on("disconnect", () => {
            console.log("User disconnected (socket) ", socket.id, new Date())
        })
    });

    return socket
}

export default socketClient