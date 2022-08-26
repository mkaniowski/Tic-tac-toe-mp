const createRoom = (socket: any, username: string, next: Function, setRoomID: Function, setSocket: Function) => {
    socket.auth = { username }
    socket.connect()
    // console.log("PRE createRoom values: ", socket.id, socket.auth.username)
    socket.once("connect", () => {
        setSocket(socket)
        console.log("Creating room...")
        socket.emit("create-room", (res: number) => {
            console.log("Created room:", res)
            setRoomID(res)
            socket.emit("join-room", socket.id, socket.auth.username, res)
            next(3)
        })
    });
}

export default createRoom