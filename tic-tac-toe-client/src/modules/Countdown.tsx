import { useCountdown } from "../services/useCountdown";
import { Loading, Count } from "./Countdown.style";

const Countdown = (props: any): any => {

    const countdown = useCountdown(3000)

    if (countdown >= 0) {
        return (
            <Count>{ countdown }</Count>
        )
    } else if ((countdown === -1) && !(props.ready[0] && props.ready[1])) {
        console.log("Error during sturtup! Opponent left.")
        props.socket.disconnect()
        props.setMenu(0)
    } else if ((countdown === -1) && (props.ready[0] && props.ready[1])) {
        props.socket.emit("start", props.room, (res: any) => {
            if (res === "ok") {
                props.setMenu(4)
                console.log("Game on!")
            } else {
                console.log("Error during sturtup!", res, props.ready[0], props.ready[1])
                props.socket.disconnect()
                props.setMenu(0)
            }
        })
    }
    return (<Loading><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></Loading>)
}

export default Countdown