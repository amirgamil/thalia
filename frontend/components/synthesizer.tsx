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

export const Synthesizer = () => {
    const [notes, setNotes] = React.useState<Notes>({ stringNotes: [], musicNotes: [] });
    const [lastNote, setLastNote] = React.useState<NoteType[]>([]);
    const [resetFullTune, setResetFullTune] = React.useState<boolean>(false);
    //FIXME: left off here
    const [rawMusic, setRawMusic] = React.useState<string>("");

    React.useEffect(() => {
        if (resetFullTune) {
            const restart = setTimeout(() => {
                setResetFullTune(false);
            }, 3000);
            return () => {
                clearTimeout(restart);
            };
        }
    }, [resetFullTune]);

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
        setResetFullTune(true);
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
            {/* We need to start and stop the song with new steps to ensure the latest one fully loads*/}
            <Song isPlaying={!resetFullTune} bpm={160} volume={3} isMuted={false}>
                <Track
                    steps={resetFullTune ? [] : notes.musicNotes}
                    volume={0}
                    pan={0}
                    mute={false}
                    onStepPlay={(step, index) => {
                        console.log(index, step);
                    }}
                >
                    <Instrument type="synth" />
                </Track>
            </Song>
        </Container>
    );
};

export const NotesDisplay: React.FC<{ notes: string[] }> = ({ notes }) => {
    return <p>{notes.join(" ")}</p>;
};
