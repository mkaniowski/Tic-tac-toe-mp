const createRoom = (socket: any, username: string, next: Function, setRoomID: Function) => {
    socket.auth = { username }
    socket.connect()
    console.log("PRE createRoom values: ", socket.id, socket.auth.username)
    socket.once("connect", () => {
        console.log("createRoom values: ", socket.id)
        socket.emit("create-room", socket.id)
        socket.once("room-id", (roomID: any) => {
            console.log("Recived roomID", roomID)
            setRoomID(roomID)
            socket.emit("join-room", socket.id, socket.auth.username, roomID)
            next(3)
        })
    });
}

export default createRoom