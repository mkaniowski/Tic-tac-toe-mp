import { toast } from 'react-toastify';
type Player = {
    id: String;
    name: String;
}

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
                toast.success("Successfully joined room!")
                console.log("Successfully joined room", room)
            } else if (res == "full") {
                console.log("Room", room, "is full")
            } else if (res == "not_found") {
                console.log("Room", room, "is not found")
            } else {
                console.log("Failed to join room", room)
            }
        })
        socket.emit("get-users-room", room, username, (res: Array<Player>) => {
            console.log("joinRoom get-users-room", res)
            setPlayers({
                player1: res[0].name,
                player2: res[1].name
            })
        })
    });
}

export default joinRoom