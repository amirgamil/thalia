export const songStorageABI = [
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: "string", name: "name", type: "string" },
            { indexed: false, internalType: "uint256", name: "id", type: "uint256" },
            { indexed: false, internalType: "uint256", name: "bpm", type: "uint256" },
        ],
        name: "NewSongCreated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: "string", name: "name", type: "string" },
            { indexed: false, internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "SongDeleted",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: "string", name: "name", type: "string" },
            { indexed: false, internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "SongEdited",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: "string", name: "name", type: "string" },
            { indexed: false, internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "SongMinted",
        type: "event",
    },
    {
        inputs: [
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "bytes32[]", name: "newNotes", type: "bytes32[]" },
        ],
        name: "addNotes",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "string", name: "_name", type: "string" },
            { internalType: "uint256", name: "bpm", type: "uint256" },
        ],
        name: "createNewSong",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "string", name: "_name", type: "string" },
            { internalType: "uint256", name: "bpm", type: "uint256" },
            { internalType: "bytes32[]", name: "newNotes", type: "bytes32[]" },
        ],
        name: "createNewSongWithNotes",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
        name: "deleteSong",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "getAllSongs",
        outputs: [
            {
                components: [
                    { internalType: "string", name: "name", type: "string" },
                    { internalType: "bool", name: "isMinted", type: "bool" },
                    { internalType: "bool", name: "isDeleted", type: "bool" },
                    { internalType: "bytes32[]", name: "notes", type: "bytes32[]" },
                    { internalType: "uint32", name: "id", type: "uint32" },
                    { internalType: "uint32", name: "bpm", type: "uint32" },
                ],
                internalType: "struct SharedDataStructures.Song[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getNumberOfSongs",
        outputs: [{ internalType: "uint32", name: "", type: "uint32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
        name: "getSongFromId",
        outputs: [
            { internalType: "string", name: "", type: "string" },
            { internalType: "bool", name: "", type: "bool" },
            { internalType: "bool", name: "", type: "bool" },
            { internalType: "bytes32[]", name: "", type: "bytes32[]" },
            { internalType: "uint32", name: "", type: "uint32" },
            { internalType: "uint32", name: "", type: "uint32" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
        name: "mintSong",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "", type: "address" }],
        name: "songOwnerCount",
        outputs: [{ internalType: "int256", name: "", type: "int256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "songToOwner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "songs",
        outputs: [
            { internalType: "string", name: "name", type: "string" },
            { internalType: "bool", name: "isMinted", type: "bool" },
            { internalType: "bool", name: "isDeleted", type: "bool" },
            { internalType: "uint32", name: "id", type: "uint32" },
            { internalType: "uint32", name: "bpm", type: "uint32" },
        ],
        stateMutability: "view",
        type: "function",
    },
];
