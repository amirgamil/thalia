import * as React from "react";
import { Synthesizer } from "./synthesizer";

interface Props {
    bpm: number;
    rawNotes: string;
    updateSongCallback: (newNotes: string[]) => void;
}

export const Playground: React.FC<Props> = ({ bpm, updateSongCallback, rawNotes }: Props) => {
    return (
        <div className="rounded-md w-full h-full">
            <Synthesizer rawNotes={rawNotes} updateSongCallback={updateSongCallback} bpm={bpm} />
        </div>
    );
};
