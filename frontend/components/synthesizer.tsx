import { Song, Track, Instrument, StepNoteType } from "reactronica";
import * as React from "react";
import styled from "styled-components";
import { Textarea } from "./textarea";
import { getNoteFromLetter, memoizedNoteIndices } from "../lib/musicMappings";
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

interface MusicalShape {
    xCoord: number;
    yCoord: number;
    shape: string;
    //assume all rectangles for now
    width: number;
    height: number;
    note: string;
    delta: number;
}

interface LastHighlightPosition {
    x: number;
    y: number;
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
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const lastShapeNote = React.useRef<MusicalShape>();
    const lastPosition = React.useRef<LastHighlightPosition>();

    React.useEffect(() => {
        if (resetFullTune) {
            const restart = setTimeout(() => {
                setResetFullTune(false);
            }, 2000);
            return () => {
                clearTimeout(restart);
            };
        }
    }, [resetFullTune, rawMusic]);
    React.useEffect(() => {
        const canvas: any = document.getElementById("shapeshifter");
        if (canvas) {
            //get CSS width
            let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
            //scale the canvas
            canvas.setAttribute("width", style_width * window.devicePixelRatio);
        }
    });

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
            <Song isPlaying={!resetFullTune} bpm={bpm} volume={3} isMuted={false}>
                <Track
                    steps={resetFullTune ? [] : notes.musicNotes}
                    volume={3}
                    pan={0}
                    mute={false}
                    onStepPlay={(note, index) => {
                        if (!canvasRef.current) return;
                        const ctx = canvasRef.current.getContext("2d");
                        if (!ctx) return;
                        if (!window) return;

                        if (lastShapeNote.current) {
                            //leave trace
                            ctx.clearRect(
                                lastShapeNote.current.xCoord + 1,
                                lastShapeNote.current.yCoord + 1,
                                lastShapeNote.current.width - 2,
                                lastShapeNote.current.height - 2
                            );
                            ctx.beginPath();
                        }
                        if (note.length !== 0) {
                            const currNote = note[0].name;
                            if (currNote) {
                                const noteIndex = memoizedNoteIndices.get(currNote);
                                if (!noteIndex) return;

                                const tone = currNote.charAt(0);
                                const xCoord = Math.floor(noteIndex / (window.innerWidth / 50)) * 50;
                                const yCoord = Math.floor(noteIndex % (400 / 50)) * 50;

                                const shapeNote = {
                                    xCoord,
                                    yCoord,
                                    shape: "rectangle",
                                    width: 50,
                                    height: 50,
                                    delta: 0,
                                    note: tone,
                                };
                                ctx.beginPath();

                                ctx.fillStyle = "black";

                                if (
                                    index !== 0 &&
                                    lastShapeNote.current &&
                                    shapeNote.note === lastShapeNote.current.note
                                ) {
                                    shapeNote.width = shapeNote.width + lastShapeNote.current.delta;
                                    shapeNote.height = shapeNote.height + lastShapeNote.current.delta;
                                    shapeNote.delta = lastShapeNote.current.delta + 5;
                                }
                                ctx.fillRect(shapeNote.xCoord, shapeNote.yCoord, shapeNote.width, shapeNote.height);
                                ctx.stroke();
                                lastShapeNote.current = shapeNote;
                            }
                        }
                    }}
                >
                    <Instrument type="synth" oscillator={{ type: "sine" }} />
                </Track>
            </Song>
            <canvas
                id="shapeshifter"
                height="400"
                style={{ width: "100%", position: "relative", zIndex: 0 }}
                ref={canvasRef}
            ></canvas>
        </Container>
    );
};

export const NotesDisplay: React.FC<{ notes: string[] }> = ({ notes }) => {
    return <p className="opacity-60">Notes: {notes.join(" ")}</p>;
};
