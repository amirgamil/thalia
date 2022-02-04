# Thalia

This project is an experiment at on-chain music composition. It's an append-only interface for composing music together and telling visual stories with your music, straight from your keyboard.

### How it works

You can use the playground to make some music and shapes

### How it's built

My implementation is surprisingly simple (on the smart contract side at least)! Songs which are added live on-chain. The raw keyboard letters (the one you see as you type) are stored as an array of bytes (which is more gas-optimized than an arbitrary length string!), as well as their corresponding metadata, like beats per minute (bpm), name etc. on-chain.

These letters are then mapped to corresponding notes, (i.e. synthesized) in the client using [Reactronica](https://reactronica.com/) (which uses [ToneJS](https://tonejs.github.io/) under the hood), where we store an array that maps letters to their corresponding notes. Technically, this could also be stored on-chain, but I wanted to keep gas costs low, so the logic moved to the client.

### Stack

Smart contracts are written in Solidity, with forge for testing, and Hardhat for deployments. Note if you see any noticeable problems with my Solidity code, please open an issue, I'm still learning!

### Running it

To run it locally, you'll need to install `hardhat`. I have it installed globally with npm, you can do that or add it as a dependency in the outer `package.json`. You'll first need to

1. Rename the `hardhat.config.template.ts` to `hardhat.config.ts`.
2. Run a simple ethereum node locally via hardhat - `npx hardhat node`
3. Then you need to deploy the smart contract, with `npx hardhat deploy` (in a different terminal window after you've run the node!)
    - Note this calls all deploy scripts in the deploy folder
    - You should see a broadcasted transacton with the deployed smart contract
4. Running the node locally provides a set of addresses with some `ETH` in them, add your favorite one to Metamask (or your wallet of your choice)
    - Make sure you select the `127.0.0.1:8545` network
5. Then run the client by going into the frontend directory and calling `npm run dev`:
    - `cd frontend && npm run dev`
6. And then you're set!

You can run the test suite via `forge test`, but make sure you have it installed first.

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
