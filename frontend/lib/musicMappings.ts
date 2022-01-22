//TODO: figure the correct sequential mapping
export const lettersToNotesMap: Record<string, string | null> = {
    A: "C4",
    B: "B4",
    C: "D4",
    D: "C5",
    E: "B5",
    F: "D5",
    " ": null,
};

export const getNoteFromLetter = (val: string) => {
    //FIXME: handle more letters
    return lettersToNotesMap[val.toUpperCase()];
};
