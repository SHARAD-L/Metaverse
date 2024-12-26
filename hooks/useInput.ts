import { useEffect, useState } from 'react'

export const useInput = () => {
    const [input, setInput] = useState({
        forward: false,
        backward: false,
        left: false,
        right: false,
        shift: false,
        jump: false,
    });

    const keys = {
        KeyW: "forward", // Fixed case
        KeyS: "backward", // Fixed case
        KeyA: "left", // Fixed case
        KeyD: "right", // Fixed case
        ArrowUp: "forward", // Fixed case
        ArrowDown: "backward", // Fixed case
        ArrowLeft: "left", // Fixed case
        ArrowRight: "right", // Fixed case
        ShiftLeft: "shift", // Fixed case
        Space: "jump",
    };

    const findKey = (key: string) => keys[key];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const action = findKey(e.code);
            if (action) {
                setInput((m) => ({ ...m, [action]: true }));
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            const action = findKey(e.code);
            if (action) {
                setInput((m) => ({ ...m, [action]: false }));
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return input;
};
