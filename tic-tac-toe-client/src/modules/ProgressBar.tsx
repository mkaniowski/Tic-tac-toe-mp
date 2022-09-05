import { Bar } from "./ProgressBar.style"
import { useCountdown } from "../services/useCountdown"

const ProgressBar = () => {
    const timer = useCountdown(10000) * 10

    return (
        <Bar progress={ timer }><div></div></Bar>
    )
}

export default ProgressBar