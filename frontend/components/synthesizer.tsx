import { Song, Track, Instrument, StepNoteType, StepType, MidiNote } from "reactronica";
import * as React from "react";
import styled from "styled-components";
import { Textarea } from "./textarea";
import { getNoteFromLetter } from "../lib/musicMappings";
import { mapRawMusicToSteps, Notes } from "../lib/musicHelpers";

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

interface Props {
    bpm: number;
    rawNotes: string;
    updateSongCallback: (newNotes: string) => void;
    prevMusicNotes: string;
    isLoading: boolean;
}

export const Synthesizer: React.FC<Props> = ({
    bpm,
    updateSongCallback,
    rawNotes,
    prevMusicNotes,
    isLoading,
}: Props) => {
    const [notes, setNotes] = React.useState<Notes>(mapRawMusicToSteps(rawNotes));
    const [lastNote, setLastNote] = React.useState<NoteType[]>([]);
    const [resetFullTune, setResetFullTune] = React.useState<boolean>(false);
    const [rawMusic, setRawMusic] = React.useState<string>(rawNotes);

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

    const convertMusicToSteps = (rawMusic: string) => {
        updateSongCallback(rawMusic);
        setNotes(mapRawMusicToSteps(rawMusic));
    };

    const updateFromRawMusic = (val: string) => {
        setRawMusic(val);
        convertMusicToSteps(val);
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
            <Textarea
                isLoading={isLoading}
                uneditableText={prevMusicNotes}
                setIndividualNote={playSingleNote}
                value={rawMusic}
                setValue={updateFromRawMusic}
            />
            <NotesDisplay notes={notes.stringNotes} />
            <Song>
                <Track>
                    <Instrument type="synth" notes={lastNote} />
                </Track>
            </Song>
            {/* Unmute */}
            <Song isPlaying={!resetFullTune} bpm={bpm} volume={3} isMuted={true}>
                <Track steps={resetFullTune ? [] : notes.musicNotes} volume={0} pan={0} mute={false}>
                    <Instrument type="synth" />
                </Track>
            </Song>
        </Container>
    );
};

export const NotesDisplay: React.FC<{ notes: string[] }> = ({ notes }) => {
    return <p>{notes.join(" ")}</p>;
};
