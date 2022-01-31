import { StepType, MidiNote } from "reactronica";
import { getNoteFromLetter } from "../lib/musicMappings";
export interface Notes {
    stringNotes: string[];
    musicNotes: StepType[];
}

export const mapRawMusicToSteps = (rawMusic: string): Notes => {
    const newStringNotes: string[] = [];
    const newMusicNotes: StepType[] = [];

    for (let i = 0; i < rawMusic.length; i++) {
        const note = getNoteFromLetter(rawMusic.charAt(i));
        if (note === null) {
            newStringNotes.push(" _ ");
            newMusicNotes.push(note);
        } else if (note) {
            newStringNotes.push(note);
            newMusicNotes.push(note as MidiNote);
        }
    }

    return { stringNotes: newStringNotes, musicNotes: newMusicNotes };
};

export const mapUintArrayToMusic = (music: Uint32Array) => {
    return mapRawMusicToSteps(music.join(""));
};

const mapNoteToOpacity = () => {};
