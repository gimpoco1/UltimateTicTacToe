import React, { useEffect, useState, useRef } from 'react';

export default function CountDown(props) {
    const [elapsed, setElapsed] = useState(0);
    const timerRef = useRef(null);
    const lastTickRef = useRef(null);

    const tick = () => {
        setElapsed((prevElapsed) => {
            const now = new Date();
            const date = now - lastTickRef.current;
            const updatedElapsed = prevElapsed + date;

            const remaining = props.seconds - updatedElapsed / 1000;
            if (remaining < 0.15) {
                props.timeOverCallback(props.player);
            }

            return updatedElapsed;
        });

        lastTickRef.current = new Date();
    };

    const pause = () => {
        clearInterval(timerRef.current);
        timerRef.current = null;
        lastTickRef.current = null;
    };

    const resume = () => {
        timerRef.current = setInterval(tick, 1000);
        lastTickRef.current = new Date();
    };

    useEffect(() => {
        if (props.isPaused) {
            pause();
        } else if (!timerRef.current) {
            resume();
        }

        return () => {
            pause();
        };
    }, [props.isPaused]);

    const remaining = props.seconds - Math.floor(elapsed / 1000);
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;

    return <p className="countdown">{("0" + minutes).slice(-2)}:{("0" + seconds).slice(-2)}</p>;
}
