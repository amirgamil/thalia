//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

library SharedDataStructures {
    struct Song {
        string name;
        //@notice, a song that has been minted into an NFT and stored on the Permaweb
        //can no longer be added to it.
        bool isMinted;
        //@notice we keep a record of whether a song has been deleted or not
        //to avoid to having to make an expensive write to adjust ids of existing songs.
        //Instead, we set this boolean variable and delete notes.
        //Any interaction with this song checks that this is not deleted
        bool isDeleted;
        //@notice array of characters that compromise the notes of the song. These
        //get directly synthesized in the client by mapping them to actual notes.
        //We uses bytes32 since each character in a song is of a fixed size, and
        //this is more gas-optimized/cheaper
        bytes32[] notes;
        //@notice we use uint32 for struct packing
        uint32 id;
        uint32 bpm;
    }
}