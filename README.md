# Thalia

On-chain music composition

1. How are we storing the music?

-   Any person can create a new song
-   Any person (for now) can contribute to any publicly available song
-   All song data lives in a separate contract
    -   Map of song id to owner addresses
    -   Map of owner addresses to song ids
-   Array of structs of all of the songs
-   Let owner end song creation whenever they want, let owner end whenever they want
    (contract for this logic - Owner.sol)
-

TODO

-   Add fuzzing to tests
-   Look into casting whether it will cost more gas (estimateGas)
-   Mint resulting song into an NFT
