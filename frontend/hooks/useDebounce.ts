import { useState, useEffect } from "react";

// Slightly modified from debounce hook from https://usehooks.com/useDebounce/

//Function return value after delay, otherwise returns false
function useDebounce<T>(value: T[], delay: number, resetFullTune: boolean): { fullTune: T[]; played: boolean } {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState<T[]>([]);

    console.log("debounced: ", debouncedValue);

    useEffect(
        () => {
            // Update debounced value after delay
            const interval = setInterval(() => {
                setDebouncedValue(value);
                setTimeout(() => setDebouncedValue([]), delay * 0.5);
            }, delay);
            // Cancel the timeout if value changes (also on delay change or unmount)
            // This is how we prevent debounced value from updating if value is changed ...
            // .. within the delay period. Timeout gets cleared and restarted.
            return () => {
                clearInterval(interval);
            };
        },
        [value, delay, resetFullTune] // Only re-call effect if value or delay changes
    );
    const played = debouncedValue.length !== 0 ? true : false;
    return { fullTune: debouncedValue, played };
}

export default useDebounce;
