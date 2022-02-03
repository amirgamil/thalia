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

export interface Song {
    name: string;
    bpm: number;
    id: number;
    //Returns an array of byte32 strings
    notes: string[];
    isDeleted: boolean;
    isMinted: boolean;
}

export const mapArrToSong = (arr: any[]): Song => {
    const song: any = {};

    if (typeof arr[0] === "string") {
        song.name = arr[0];
    }

    if (typeof arr[1] === "boolean") {
        song.isMinted = arr[1];
    }

    if (typeof arr[2] === "boolean") {
        song.isDeleted = arr[2];
    }

    if (Array.isArray(arr[3])) {
        song.notes = arr[3];
    }

    if (typeof arr[4] === "number") {
        song.id = arr[4];
    }

    if (typeof arr[5] === "number") {
        song.bpm = arr[5];
    }

    return song as Song;
};
