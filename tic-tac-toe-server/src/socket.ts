import { Server } from "socket.io"

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

const socketServer = (httpServer: any) => {
    const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
        cors: {
            origin: "*"
        }
    })

    io.on("connection", (socket: any) => {
        console.log("user connected", socket.id, new Date())
        socket.on("disconnect", () => {
            console.log("user disconnected", socket.id, new Date())
        })
    })

}

export default socketServer
