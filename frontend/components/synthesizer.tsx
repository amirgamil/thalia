import { Song, Track, Instrument, StepNoteType, StepType, MidiNote } from "reactronica";
import * as React from "react";
import styled from "styled-components";
import { Textarea } from "./textarea";
import { getNoteFromLetter } from "../lib/musicMappings";
import useDebounce from "../hooks/useDebounce";

//FIXME: not ideal, copied from the reactronic types
type NoteType = {
    name: string;
    velocity?: number;
    duration?: number | string;
    /** Use unique key to differentiate from same notes, otherwise it won't play */
    key?: string | number;
};

//Revisit these types soon, starting with one layer simple for now
type LayerNotes = MusicalNote[];
type MusicalNote = StepNoteType | EmptyNote;
type EmptyNote = { name: " "; kind: "empty"; type: "note"; duration?: number };

const Container = styled.div`
    width: 100%;
`;

interface Notes {
    stringNotes: string[];
    musicNotes: StepType[];
}

export const Synthesizer = ({ isPlaying }: { isPlaying: boolean }) => {
    const [notes, setNotes] = React.useState<Notes>({ stringNotes: [], musicNotes: [] });
    const [lastNote, setLastNote] = React.useState<NoteType[]>([]);
    //FIXME: left off here
    const fullTune = useDebounce(notes, 3000);
    const [rawMusic, setRawMusic] = React.useState<string>("");

    const mapRawMusicToSteps = (rawMusic: string) => {
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
        setNotes({ stringNotes: newStringNotes, musicNotes: newMusicNotes });
    };

    const updateFromRawMusic = (val: string) => {
        setRawMusic(val);
        mapRawMusicToSteps(val);
    };

    const playSingleNote = (val: string) => {
        if (!val) {
            setLastNote([]);
        } else {
            const note = getNoteFromLetter(val);
            if (note) {
                setLastNote([{ name: note }]);
            }
        }
    };

    return (
        <Container>
            {/* Custom keyboard component  */}
            {/* <Keyboard onMouseDown={(notes) => setNotes(notes)} onMouseUp={() => setNotes([])} /> */}
            <NotesDisplay notes={notes.stringNotes} />
            <Textarea setIndividualNote={playSingleNote} value={rawMusic} setValue={updateFromRawMusic} />
            <Song>
                <Track>
                    <Instrument type="synth" notes={lastNote} />
                </Track>
            </Song>
            <Song isPlaying={true} bpm={130} volume={3} isMuted={false}>
                <Track steps={fullTune} volume={0} pan={0} mute={false}>
                    <Instrument type="synth" />
                </Track>
            </Song>
        </Container>
    );
};

export const NotesDisplay: React.FC<{ notes: string[] }> = ({ notes }) => {
    return <p>{notes.join(" ")}</p>;
};
