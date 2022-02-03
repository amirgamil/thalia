// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "../lib/ds-test/src/test.sol";
import "../contracts/SongStorage.sol";

interface Hevm {
    // Sets the *next* call's msg.sender to be the input address
    function prank(address) external;
    // Sets all subsequent calls' msg.sender to be the input address until `stopPrank` is called
    function startPrank(address) external;
    // Sets the *next* call's msg.sender to be the input address, and the tx.origin to be the second input
    function prank(address,address) external;
    // Sets all subsequent calls' msg.sender to be the input address until `stopPrank` is called, and the tx.origin to be the second input
    function startPrank(address,address) external;
    // Resets subsequent calls' msg.sender to be `address(this)`
    function stopPrank() external;
}

contract ContractTest is DSTest {
    SongStorage songStorage;
    Hevm hevm = Hevm(HEVM_ADDRESS);

    function setUp() public {
        songStorage = new SongStorage();
    }

    //@notice helper method to compare to bytes32 arrays
    function assertEq(bytes32[] memory a, bytes32[] memory b) public {
        if (a.length != b.length) {
            fail();
        }

        for (uint i=0; i < a.length; i++) {
            assertEq(a[i], b[i]);
        }
    }

    function testSongCreation() public {
        songStorage.createNewSong("new song", 120);
        SharedDataStructures.Song[] memory allSongs = songStorage.getAllSongs();
        assertTrue(allSongs.length == 1);
        assertEq(allSongs[0].name, "new song");
    }

    function testSongCreationWithNotes() public {
        bytes32[] memory newNotes = new bytes32[](3);
        newNotes[0] = bytes32("!");
        newNotes[1] = bytes32("A");
        newNotes[2] = bytes32("B");
        songStorage.createNewSongWithNotes("new song", 120, newNotes);

        SharedDataStructures.Song[] memory allSongs = songStorage.getAllSongs();
        assertTrue(allSongs.length == 1);
        assertEq(allSongs[0].name, "new song");
        assertEq(allSongs[0].notes, newNotes);
    }

    function testValidAddingToSong()  public {
        songStorage.createNewSong("new song", 120);
        bytes32[] memory newNotes = new bytes32[](3);
        newNotes[0] = bytes32("!");
        newNotes[1] = bytes32("A");
        newNotes[2] = bytes32("B");
        songStorage.addNotes(0, newNotes);
        SharedDataStructures.Song[] memory allSongs = songStorage.getAllSongs();
        assertEq(allSongs[0].notes, newNotes);

        bytes32[] memory moreNewNotes = new bytes32[](4);
        moreNewNotes[0] = bytes32("C");
        moreNewNotes[1] = bytes32("H");
        moreNewNotes[2] = bytes32("K");
        moreNewNotes[3] = bytes32("I");

        songStorage.addNotes(0, moreNewNotes);

        //@notice since we used memory modifier, allSongs is not a pointer to the full array
        //we must refetch it
        SharedDataStructures.Song[] memory newSongs = songStorage.getAllSongs();
        bytes32[] memory expected = new bytes32[](7);

        expected[0] = bytes32("!");
        expected[1] = bytes32("A");
        expected[2] = bytes32("B");
        expected[3] = bytes32("C");
        expected[4] = bytes32("H");
        expected[5] = bytes32("K");
        expected[6] = bytes32("I");

        assertEq(newSongs[0].notes, expected);
    }

    function testFailSongOutOfBounds() view public {
        songStorage.getSongFromId(0);
    }
    
    function testFailAddToEmptySong()  public {
        emit log("started invalid adding to song");

        //@notice adding notes to a song that doesn't exist yet
        bytes32[] memory newNotes = new bytes32[](3);
        newNotes[0] = bytes32("!");
        newNotes[1] = bytes32("A");
        newNotes[2] = bytes32("B");

        //@notice should fail since no song yet exists
        songStorage.addNotes(0, newNotes);
    }

    function testFailAddToDeletedSong() public {
        //@notice adding to a song that was deleted
        uint id = songStorage.createNewSong("new song", 120);
        songStorage.deleteSong(id); 

        bytes32[] memory moreNewNotes = new bytes32[](3);
        moreNewNotes[0] = bytes32("!");
        moreNewNotes[1] = bytes32("A");
        moreNewNotes[2] = bytes32("B");

        songStorage.addNotes(id, moreNewNotes);
    }

    function testAddLargeTuneInBounds() public {
        uint newId = songStorage.createNewSong("another new song", 130);
        bytes32[] memory tooManyNotes = new bytes32[](46);
        for (uint i = 0; i < 45; i++) {
            tooManyNotes[i] = "A";
        }

        songStorage.addNotes(newId, tooManyNotes);
    }

    function testFailAddToLargeATune() public {
        uint newId = songStorage.createNewSong("another new song", 130);
        bytes32[] memory tooManyNotes = new bytes32[](52);
        for (uint i = 0; i < 51; i++) {
            tooManyNotes[i] = "A";
        }

        songStorage.addNotes(newId, tooManyNotes);
    }

    function testValidSongDeletion()  public {
        uint newId = songStorage.createNewSong("will be deleted", 90);

        bytes32[] memory moreNewNotes = new bytes32[](3);
        moreNewNotes[0] = bytes32("!");
        moreNewNotes[1] = bytes32("A");
        moreNewNotes[2] = bytes32("B");

        songStorage.addNotes(newId, moreNewNotes);
        songStorage.deleteSong(newId); 

        SharedDataStructures.Song[] memory newSongs = songStorage.getAllSongs();
        assertTrue(newSongs[0].isDeleted == true);

        //@notice testing we can still add notes to a song after being deleted
        uint newSong = songStorage.createNewSong("just another song", 90);
        songStorage.addNotes(newSong, moreNewNotes);

        SharedDataStructures.Song[] memory updatedSongs = songStorage.getAllSongs();

        assertTrue(updatedSongs[newSong].notes.length == 3);

    }

    //@notice only owner who created song can delete it 
    function testFailInvalidSongDeletion()  public {
        uint currId = songStorage.createNewSong("will be deleted", 90);

        //some random address
        address addr = 0xc0ffee254729296a45a3885639AC7E10F9d54979;
        //simulate a different msg.sender address with prank
        hevm.prank(addr);

        songStorage.deleteSong(currId);

    }

    function testFailAddToSongAfterMint() public {
        uint currId = songStorage.createNewSong("will be deleted", 90);
        songStorage.mintSong(currId);

        bytes32[] memory moreNewNotes = new bytes32[](3);
        moreNewNotes[0] = bytes32("!");
        moreNewNotes[1] = bytes32("A");
        moreNewNotes[2] = bytes32("B");

        songStorage.addNotes(currId, moreNewNotes);
    }
}
