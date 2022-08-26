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
            socket.emit("join-room", socket.id, socket.auth.username, res, (response: any) => {
                // console.log(response)
                if (response == "ok") {
                    next(3)
                    console.log("Successfully joined room", res)
                } else if (response == "full") {
                    console.log("Room", res, "is full")
                } else if (response == "not_found") {
                    console.log("Room", res, "is not found")
                } else {
                    console.log("Failed to join room", res)
                }
            })
        })
    });
}

export default createRoom