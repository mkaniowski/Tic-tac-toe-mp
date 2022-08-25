const joinRoom = (socket: any, username: string, room: number, next: Function) => {
    socket.auth = { username }
    socket.connect()
    console.log("PRE joinRoom values: ", socket.id, socket.auth.username, room)
    socket.once("connect", () => {
        console.log("joinRoom values: ", socket.id, socket.auth.username, room)
        next(3)
        socket.emit("join-room", socket.id, socket.auth.username, room)
        socket.emit("get-users-room", room)
        socket.on("users-room", (users: any) => {
            console.log(users)
        })
    });
}

export default joinRoom