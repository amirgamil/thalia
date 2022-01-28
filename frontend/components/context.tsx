import * as React from "react";
import Web3Modal from "web3modal";
import { providers, Signer } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";
import { songStorageABI } from "../abi/songStorage";

interface Context {
    openModal: () => void;
    signOut: () => void;
    attemptLogin: () => void;
    signer?: providers.JsonRpcSigner;
    provider?: providers.Web3Provider;
    contract?: ethers.Contract;
    address?: string;
}

export const AppContext = React.createContext<Context>({
    openModal: () => {},
    signOut: () => {},
    attemptLogin: () => {},
    signer: undefined,
    provider: undefined,
    contract: undefined,
    address: "",
});

export const AppContextProvider = (props: any) => {
    const [signer, setSigner] = React.useState<providers.JsonRpcSigner | undefined>(undefined);
    const [provider, setProvider] = React.useState<providers.Web3Provider | undefined>(undefined);
    const [address, setAddress] = React.useState<string | undefined>(undefined);
    const [contract, setContract] = React.useState<ethers.Contract | undefined>(undefined);

    const openModal = async () => {
        const providerOptions = {
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    rpc: {
                        1: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
                    },
                },
            },
        };
        const web3Modal = new Web3Modal({
            network: "mainnet", // optional
            cacheProvider: false, // optional
            providerOptions, // required
        });
        web3Modal.clearCachedProvider();
        const provider = new ethers.providers.Web3Provider(await web3Modal.connect());
        setProvider(provider);

        const songStorageContract = new ethers.Contract(process.env.CONTRACT_ADDRESS ?? "", songStorageABI, provider);
        setContract(songStorageContract);

        const signer = provider.getSigner();
        setSigner(signer);

        const address = await signer.getAddress();
        setAddress(address);
    };

    const signOut = () => {
        setSigner(undefined);
        setAddress(undefined);
        if (window && window.localStorage) {
            window.localStorage.setItem("WEB3_CONNECT_CACHED_PROVIDER", "");
        }
    };

    const attemptLogin = async () => {
        /* if (
      window &&
      window.localStorage &&
      window.localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER") &&
      typeof window.ethereum !== "undefined"
    ) {
      const provider = window.ethereum;
      const addresses = await provider.request({
        method: "eth_requestAccounts",
      });
      setSigner(provider);
      setAddress(addresses[0]);
    } */
    };

    return (
        <AppContext.Provider
            value={{
                openModal,
                signOut,
                attemptLogin,
                signer,
                address,
                provider,
            }}
        >
            <>{props.children}</>
        </AppContext.Provider>
    );
};

export function useAppContext() {
    return React.useContext(AppContext);
}
