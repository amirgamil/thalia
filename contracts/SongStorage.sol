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

    function getAllSongs() view public returns (SharedDataStructures.Song[] memory) {
        return songs;
    }

    function _getNumberOfSongs() view internal returns (uint32) {
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
        uint32 newId = _getNumberOfSongs();
        //@notice set limit on number of songs a person can create to prevent bots etc.
        require(songOwnerCount[msg.sender] < 15);

        songs.push(SharedDataStructures.Song({name: _name, isDeleted: false, notes: new bytes32[](0), id: newId, bpm: uint32(bpm)}));

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

    function _addNotesToSong(uint id, bytes32[] memory newNotes) internal {
        //@notice ensure we're adding to a song that actually exists
        require(id < songs.length);
        //@notice for now, can only append 15 new notes at a time
        require(newNotes.length < 15);

        SharedDataStructures.Song storage currentSong = songs[id];

        require(!currentSong.isDeleted);

        for (uint i=0; i < newNotes.length; i++) {
            currentSong.notes.push(newNotes[i]);
        }

        emit SongEdited(currentSong.name, id);

    }

    function addNotes(uint id, bytes32[] memory newNotes) public payable {
        _addNotesToSong(id, newNotes);
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


}