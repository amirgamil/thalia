import * as React from "react";
import { Synthesizer } from "./synthesizer";

interface Props {
    bpm: number;
    rawNotes: string;
    updateSongCallback: (newNotes: string) => void;
    prevMusicNotes: string;
    isLoading: boolean;
}

export const Playground: React.FC<Props> = ({
    bpm,
    updateSongCallback,
    rawNotes,
    prevMusicNotes,
    isLoading,
}: Props) => {
    return (
        <div className="rounded-md w-full">
            <Synthesizer
                isLoading={isLoading}
                prevMusicNotes={prevMusicNotes}
                rawNotes={rawNotes}
                updateSongCallback={updateSongCallback}
                bpm={bpm}
            />
        </div>
    );
};
