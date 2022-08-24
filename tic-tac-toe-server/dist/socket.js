"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const socketServer = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*"
        }
    });
    io.on("connection", (socket) => {
        console.log("user connected");
        socket.on("disconnect", () => {
            console.log("user disconnected", socket.id);
        });
    });
};
exports.default = socketServer;
//# sourceMappingURL=socket.js.map