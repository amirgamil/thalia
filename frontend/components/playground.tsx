import * as React from "react";
import { Synthesizer } from "./synthesizer";

export const Playground = () => {
    const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

    return (
        <div style={{ background: "red" }} className="rounded-md w-full h-full bg-red">
            <button onClick={() => (isPlaying ? setIsPlaying(false) : setIsPlaying(true))}>
                {isPlaying ? "Stop" : "Play"}
            </button>
            <Synthesizer isPlaying={isPlaying} />
        </div>
    );
};
