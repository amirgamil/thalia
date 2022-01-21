import * as React from "react";
import { Synthesizer } from "./synthesizer";

export const Playground = () => {
    const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

    return (
        <div className="rounded-md w-full h-full">
            <button onClick={() => (isPlaying ? setIsPlaying(false) : setIsPlaying(true))}>
                {isPlaying ? "Stop" : "Play"}
            </button>
            <Synthesizer isPlaying={isPlaying} />
        </div>
    );
};
