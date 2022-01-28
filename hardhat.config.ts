import { HardhatUserConfig } from "hardhat/types";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";

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
};
export default config;
