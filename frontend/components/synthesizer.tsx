import { Song, Track, Instrument } from "reactronica";

export const Synthesizer = ({ isPlaying }: { isPlaying: boolean }) => {
    // const [notes, setNotes] = useNotes([]);

    return (
        <>
            {/* Custom keyboard component  */}
            {/* <Keyboard onMouseDown={(notes) => setNotes(notes)} onMouseUp={() => setNotes([])} /> */}

            <Song isPlaying={isPlaying} bpm={90} volume={3} isMuted={false}>
                {/* <Track>
                    <Instrument type="synth" notes={notes} />
                </Track> */}
                <Track
                    steps={["C3", null, "F3", "G3"]}
                    volume={-3}
                    pan={0}
                    mute={false}
                    onStepPlay={(step) => {
                        // Callback that triggers on every step
                        console.log(step); // 'C3' ... 'G3' ... 'F3' ... 'G3'
                    }}
                >
                    <Instrument type="synth" />
                </Track>
            </Song>
        </>
    );
};

export const NotesDisplay = ({ notes }: { notes: string[] }) => {
    return <p>{notes.join(" ")}</p>;
};
