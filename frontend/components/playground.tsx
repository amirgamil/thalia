import * as React from "react";
import { Synthesizer } from "./synthesizer";

export const Playground: React.FC<{ bpm: number }> = ({ bpm }: { bpm: number }) => {
    return (
        <div className="rounded-md w-full h-full">
            <Synthesizer bpm={bpm} />
        </div>
    );
};
