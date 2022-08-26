const joinRoom = (socket: any, username: string, room: number, next: Function, setPlayers: Function, setSocket: Function) => {
    socket.auth = { username }
    socket.connect()
    // console.log("PRE joinRoom values: ", socket.id, socket.auth.username, room)
    socket.once("connect", () => {
        setSocket(socket)
        console.log("joinRoom values: ", socket.id, socket.auth.username, room)
        socket.emit("join-room", socket.id, socket.auth.username, room, (res: any) => {
            // console.log(res)
            if (res == "ok") {
                next(3)
                console.log("Successfully joined room", room)
            } else if (res == "full") {
                console.log("Room", room, "is full")
            } else if (res == "not_found") {
                console.log("Room", room, "is not found")
            } else {
                console.log("Failed to join room", room)
            }
        })
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