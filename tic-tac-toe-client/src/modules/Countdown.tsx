import socketClient from "../services/socketClient";
import { useCountdown } from "../services/useCountdown";
import { Loading, Count } from "./Countdown.style";

const Countdown = (props: any): any => {

    const countdown = useCountdown(3000)

    if (countdown >= 0) {
        return (
            <Count>{ countdown }</Count>
        )
    } else {
        return (<Loading><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></Loading>)
    }
}

export default Countdown