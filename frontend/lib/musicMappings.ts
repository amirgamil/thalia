import { pastelColors } from "./colors";

//TODO: figure the correct sequential mapping
export const lettersToNotesMap: Record<string, string | null> = {
    ";": "D2",
    "'": "D#2",
    "!": "E2",
    "&": "F2",
    "(": "F#2",
    ",": "G2",
    ".": "G#2",
    "/": "A2",
    ":": "A#2",
    "<": "B2",
    ">": "C3",
    "?": "C#3",
    "-": "D3",
    "3": "D#3",
    "6": "E3",
    q: "F3",
    j: "F#3",
    w: "G3",
    b: "G#3",
    "2": "A3",
    y: "A#3",
    f: "B3",
    c: "C4",
    i: "C#4",
    "5": "D4",
    e: "D#4",
    d: "E4",
    a: "F4",
    h: "F#4",
    t: "G4",
    r: "G#4",
    "4": "A4",
    u: "A#4",
    o: "C5",
    m: "C#5",
    n: "D5",
    l: "D#5",
    s: "E5",
    g: "F5",
    "1": "F#5",
    "8": "G5",
    "0": "G#5",
    p: "A5",
    v: "A#5",
    k: "B5",
    x: "C6",
    _: "C#6",
    "=": "D#6",
    "+": "D6",
    "@": "E6",
    "#": "F6",
    $: "F#6",
    "%": "G6",
    " ": null,
};

//sorted by pictch of tone
const sortedNotes = Object.entries(lettersToNotesMap).sort((a, b) =>
    a[1] && b[1] ? (a[1] < b[1] ? -1 : a[1] === b[1] ? 0 : 1) : 0
);

export const memoizedNoteIndices = new Map();
sortedNotes.forEach((el, i) => {
    memoizedNoteIndices.set(el[1], i);
});

export const getNoteFromLetter = (val: string) => {
    //FIXME: handle more letters
    return lettersToNotesMap[val.toLowerCase()];
};
