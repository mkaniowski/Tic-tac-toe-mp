import { io } from "socket.io-client";

const socketClient = (stateFn: Function) => {
    const socket = io("http://localhost:3001", { autoConnect: false })
    socket.on("connect", () => {
        console.log("user connected", socket.id, new Date());
        stateFn(true)
    });
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id, new Date())
        stateFn(false)
    })

    socket.onAny((event, ...args) => {
        console.log(event, args);
    });

    return socket
}

export default socketClient