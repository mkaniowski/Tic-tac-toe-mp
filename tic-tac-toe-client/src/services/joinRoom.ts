const joinRoom = (socket: any, username: string, room: number, next: Function, setPlayers: Function, setSocket: Function) => {
    socket.auth = { username }
    socket.connect()
    // console.log("PRE joinRoom values: ", socket.id, socket.auth.username, room)
    socket.once("connect", () => {
        setSocket(socket)
        console.log("joinRoom values: ", socket.id, socket.auth.username, room)
        next(3)
        socket.emit("join-room", socket.id, socket.auth.username, room)
        socket.emit("get-users-room", room, username, (res: Array<string>) => {
            console.log("joinRoom get-users-room", res)
            setPlayers({
                player1: res[0],
                player2: res[1]
            })
        })
    });
}

export default joinRoom