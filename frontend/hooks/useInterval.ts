import React, { useState, useEffect, useRef } from "react";

type Callback = () => void;
export const useInterval = (callback: Callback, delay: number | undefined) => {
    const savedCallback = React.useRef<Callback>();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            //@ts-ignore
            savedCallback.current();
        }
        if (delay !== undefined) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};
