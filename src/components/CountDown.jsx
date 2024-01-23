import { useEffect, useState } from 'react';

export default function CountDown(props) {
    const [elapsed, setElapsed] = useState(0);

    let timer = null;
    let lastTick = null;

    useEffect(() => {
        return () => {
            clearInterval(timer);
        };
    }, [timer]);

    const tick = () => {
        setElapsed((prevElapsed) => {
            const now = new Date();
            const date = now - lastTick;
            const updatedElapsed = prevElapsed + date;

            const remaining = props.seconds - updatedElapsed / 1000;
            if (remaining < 0.15) {
                props.timeOverCallback(props.player);
            }

            return updatedElapsed;
        });

        lastTick = new Date();
    };

    const pause = () => {
        clearInterval(timer);
        timer = null;
        lastTick = null;
    };

    const resume = () => {
        timer = setInterval(tick, 1000);
        lastTick = new Date();
    };

    useEffect(() => {
        if (props.isPaused) {
            pause();
        } else if (!timer) {
            resume();
        }

        return () => {
            pause();
        };
    }, [props.isPaused]);

    const remaining = props.seconds - Math.floor(elapsed / 1000);
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;

    return <p className="inline-block">{("0" + minutes).slice(-2)}:{("0" + seconds).slice(-2)}</p>;
}
