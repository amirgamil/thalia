import { HardhatUserConfig } from "hardhat/types";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";

const ALCHEMY_API_KEY = "";

const ROPSTEN_PRIVATE_KEY = "";

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
            url: `https://eth-ropsten.alchemyapi.io/v2/`,
        },
    },
};
export default config;
