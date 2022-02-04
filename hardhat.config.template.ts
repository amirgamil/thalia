import { HardhatUserConfig } from "hardhat/types";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";

//My hardhat file for deployment minus secrets :)
const ALCHEMY_API_KEY = "Hi :)";

const ROPSTEN_PRIVATE_KEY = "Hello :)";

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.11",
    },
    namedAccounts: {
        deployer: 0,
    },
    paths: {
        sources: "./contracts",
    },
    networks: {
        ropsten: {
            url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
            accounts: [`${ROPSTEN_PRIVATE_KEY}`],
        },
    },
};
export default config;
