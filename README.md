# Thalia

This project is an experiment at on-chain music composition. It's an append-only interface for composing music together and telling visual stories with your music, straight from your keyboard.

### How it works

My implementation is surprisingly simple (on the smart contract side at least)! Songs which are added live on-chain. The raw keyboard letters (the one you see as you type) are stored as an array of bytes (which is more gas-optimized than an arbitrary length string!), as well as their corresponding data on-chain.

These letters are then mapped to corresponding notes, (i.e. synthesized) in the client using [Reactronica](https://reactronica.com/) (which uses [ToneJS](https://tonejs.github.io/)) under the hood, where we store an array that maps letters to their corresponding notes. Technically, this could also be stored on-chain, but I wanted to keep gas costs low, so the logic moved to the client.

### Stack

Smart contracts are written in Solidity, with forge for testing, and Hardhat for deployments. Note if you see any noticeable problems with my Solidity code, please open an issue, I'm still learning!

TODO

-   [ ] Add fuzzing to tests
-   [ ] Mint resulting song into an NFT
-   [x] Test adding to songs
-   [x] Cool UI as music plays
-   [x] UI to show previous music and what you can add to it
-   [x] Figure out loading from after committing to the chain to updating grey text to black
-   [ ] Notice to turn sound on in browser
-   [ ] Take you to song screen after song has been successfully created
-   [x] Add nice loading screens during stuff (e.g. committing transactions)

If you've noticed my Alchemy API key was in my commit history, it's been deleted ;)
