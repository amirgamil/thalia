import { Song, Track, Instrument, StepNoteType, StepType, MidiNote } from "reactronica";
import * as React from "react";
import styled from "styled-components";
import { Textarea } from "./textarea";
import { getNoteFromLetter, lettersToNotesMap, memoizedNoteIndices, sortedLetters } from "../lib/musicMappings";
import { mapRawMusicToSteps, Notes } from "../lib/musicHelpers";
import { useInterval } from "../hooks/useInterval";
import { cloneDeep } from "lodash";

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

interface MusicalShape {
    xCoord: number;
    yCoord: number;
    shape: string;
    //assume all rectangles for now
    width: number;
    hide: boolean;
    height: number;
    //time before fading
    delta: number;
}
type callback = () => void;
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
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const canvasElements = React.useRef<MusicalShape[]>([]);

    React.useEffect(() => {
        if (resetFullTune) {
            const restart = setTimeout(() => {
                setResetFullTune(false);
            }, 3000);
            return () => {
                clearTimeout(restart);
            };
        }
    }, [resetFullTune, rawMusic]);

    const updateCanvasDrawing = () => {};

    const convertBackground = (note: string) => {
        const changeBackgroundEvery = bpm / 60;
        const body = document.getElementsByTagName("body")[0];
    };

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
                <Track
                    steps={resetFullTune ? [] : notes.musicNotes}
                    volume={0}
                    pan={0}
                    mute={false}
                    onStepPlay={(note, index) => {
                        if (note.length !== 0) {
                            const currNote = note[0].name;
                            if (currNote) {
                                //note compromised of two unique things, tone and pitch
                                //use those two variables to generate a corresponding shape at a unique position

                                const note = currNote.charAt(0);
                                const pitch = parseInt(currNote.charAt(1));

                                const xCoord = (pitch / 7) * 500;
                                const yCoord =
                                    ((note.toLowerCase().charCodeAt(0) - "a".toLowerCase().charCodeAt(0)) / 8) * 500;

                                if (!canvasRef.current) return;
                                const ctx = canvasRef.current.getContext("2d");
                                if (!ctx) return;
                                ctx.clearRect(shape.xCoord - 1, shape.yCoord - 1, shape.width + 2, shape.height + 2);
                                ctx.beginPath();
                                ctx.fillStyle = "black";
                                ctx.fillRect(shape.xCoord, shape.yCoord, shape.width, shape.height);
                                ctx.stroke();
                                shape.hide = true;
                                if (index < canvasElements.current.length) {
                                    canvasElements.current[index].hide = false;
                                } else {
                                    canvasElements.current.push({
                                        xCoord,
                                        yCoord,
                                        shape: "rectangle",
                                        width: 50,
                                        height: 50,
                                        delta: 0,
                                        hide: false,
                                    });
                                }
                            }
                        }
                        console.log(canvasElements.current.length);
                        updateCanvasDrawing();
                    }}
                >
                    <Instrument type="synth" oscillator={{ type: "sine" }} />
                </Track>
            </Song>
            <canvas width={500} height={500} ref={canvasRef}></canvas>
        </Container>
    );
};

export const NotesDisplay: React.FC<{ notes: string[] }> = ({ notes }) => {
    return <p>{notes.join(" ")}</p>;
};
