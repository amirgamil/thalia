import * as React from "react";
import { Synthesizer } from "./synthesizer";

interface Props {
    bpm: number;
    rawNotes: string;
    updateSongCallback: (newNotes: string) => void;
    prevMusicNotes: string;
}

export const Playground: React.FC<Props> = ({ bpm, updateSongCallback, rawNotes, prevMusicNotes }: Props) => {
    return (
        <div className="rounded-md w-full h-full">
            <Synthesizer
                prevMusicNotes={prevMusicNotes}
                rawNotes={rawNotes}
                updateSongCallback={updateSongCallback}
                bpm={bpm}
            />
        </div>
    );
};
