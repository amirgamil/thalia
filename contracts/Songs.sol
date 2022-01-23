pragma solidity ^0.8.10;


contract SongStorage {
    struct Song {
        string name;
        //@notice we keep a record of whether a song has been deleted or not
        //to avoid to having to make an expensive write to remove everything.
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
    Song[] public songs;
    mapping (uint => address) public songToOwner; 
    mapping (address => int) public songOwnerCount; 

    //@notice event for when a new song is made
    event NewSongCreated (string name, uint id, uint bpm);
    event SongEdited (string name, uint id);
    event SongDeleted(string name, uint id);

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

    function _createSong(string memory _name, uint bpm) internal {
        uint32 newId = _getNumberOfSongs();

        Song memory newSong;

        newSong.name = _name;
        newSong.isDeleted = false;
        newSong.id = newId;
        newSong.bpm = uint32(bpm);

        songs.push(newSong);

        songToOwner[newId] = msg.sender;
        //@notice we don't need to check if this exists due to Solidity's design of mappings
        songOwnerCount[msg.sender]++;

        emit NewSongCreated(_name, newId, bpm);
    }  

    //TODO: not sure about payable here
    function createNewSong(string memory _name, uint bpm) public payable {
        _createSong(_name, bpm);
    }

    function _addNotesToSong(uint id, bytes32[] memory newNotes) internal {
        //@notice ensure we're adding to a song that actually exists
        require(id < songs.length);
        Song storage currentSong = songs[id];
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

        songs[id].isDeleted = true;

        emit SongDeleted(songs[id].name, id);
    }


}