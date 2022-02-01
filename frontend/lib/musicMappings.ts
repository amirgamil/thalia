//TODO: figure the correct sequential mapping
export const lettersToNotesMap: Record<string, string | null> = {
    A: "C4",
    B: "B4",
    C: "D4",
    D: "C5",
    E: "B5",
    F: "D5",
    // O: "",
    // M: "",
    // O: "",
    // O: "",
    // O: "",
    // O: "",
    // O: "",
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
    return lettersToNotesMap[val.toUpperCase()];
};
