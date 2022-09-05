import { useEffect, useState } from 'react';

const useCountdown = (timer: number) => {
    const countDownDate = new Date().getTime() + timer
    const now = new Date().getTime()

    const [diff, setDiff] = useState(Math.ceil((countDownDate - now) / 1000))

    useEffect(() => {
        const interval = setInterval(() => {
            let tmp = (countDownDate - new Date().getTime()) / 1000
            if (tmp < -1) {
                tmp = -1
            }
            setDiff(Math.ceil(tmp))
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return diff
};

export { useCountdown };
