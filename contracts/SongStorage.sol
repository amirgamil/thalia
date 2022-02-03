//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "./SharedDataStructures.sol";

contract SongStorage {
    SharedDataStructures.Song[] public songs;
    mapping (uint => address) public songToOwner; 
    mapping (address => int) public songOwnerCount; 

    //@notice event for when a new song is made
    event NewSongCreated (string name, uint id, uint bpm);
    event SongEdited (string name, uint id);
    event SongDeleted(string name, uint id);
    event SongMinted(string name, uint id);

    function getAllSongs() view public returns (SharedDataStructures.Song[] memory) {
        return songs;
    }

    function getSongFromId(uint id) view public returns (string memory, bool, bool, bytes32[] memory, uint32, uint32) {
        require(id < songs.length);

        SharedDataStructures.Song memory currSong = songs[id];

        return (currSong.name, currSong.isMinted, currSong.isDeleted, currSong.notes, currSong.id, currSong.bpm);
    }

    function getNumberOfSongs() view public returns (uint32) {
        return uint32(songs.length);
    }

    function _getSongOwner(uint id) view internal returns (address) {
        return songToOwner[id];
    }

    modifier onlySongOwner(uint id) {
        require(msg.sender == _getSongOwner(id));
        _;
    }

    function _createSong(string memory _name, uint bpm) internal returns (uint) {
        uint32 newId = getNumberOfSongs();
        //@notice set limit on number of songs a person can create to prevent bots etc.
        require(songOwnerCount[msg.sender] < 50);

        songs.push(SharedDataStructures.Song({name: _name, isMinted: false, isDeleted: false, notes: new bytes32[](0), id: newId, bpm: uint32(bpm)}));

        songToOwner[newId] = msg.sender;
        //@notice we don't need to check if this exists due to Solidity's design of mappings
        songOwnerCount[msg.sender]++;

        emit NewSongCreated(_name, newId, bpm);

        return newId; 
    }  

    //@notice returns the id of the newly created song
    function createNewSong(string memory _name, uint bpm) public returns (uint) {
        return _createSong(_name, bpm);
    }
    
    //@notice creates a new song like above, but also adds notes to the songs. This is done to optimize gas
    //as opposed to calling createSong and then addNotes
    function createNewSongWithNotes(string memory _name, uint bpm, bytes32[] memory newNotes) public returns (uint) {
        uint id = _createSong(_name, bpm);

        SharedDataStructures.Song storage newSong = songs[id];
        newSong.notes = newNotes;

        return id;
    }

    function _addNotesToSong(uint id, bytes32[] memory newNotes) internal returns (bytes32[] memory) {
        //@notice ensure we're adding to a song that actually exists
        require(id < songs.length);
        //@notice for now, can only append 50 new notes at a time
        require(newNotes.length < 50);

        SharedDataStructures.Song storage currentSong = songs[id];

        require(!currentSong.isDeleted);
        require(!currentSong.isMinted);

        for (uint i=0; i < newNotes.length; i++) {
            currentSong.notes.push(newNotes[i]);
        }

        emit SongEdited(currentSong.name, id);

        return currentSong.notes;

    }

    //@notice returns the full new song notes
    function addNotes(uint id, bytes32[] memory newNotes) public returns (bytes32[] memory) {
        return _addNotesToSong(id, newNotes);
    }

    function deleteSong(uint id) onlySongOwner(id) public {
        require(id < songs.length);
        require(!songs[id].isDeleted);

        songs[id].isDeleted = true;
        //@notice we delete the most expensive part of storing a song and bpm
        //which will no longer be used
        delete songs[id].notes;
        delete songs[id].bpm;

        emit SongDeleted(songs[id].name, id);
    }

    function mintSong(uint id) public {
        require(id < songs.length);
        require(!songs[id].isDeleted);

        songs[id].isMinted = true;

        emit SongMinted(songs[id].name, id);

    }

}