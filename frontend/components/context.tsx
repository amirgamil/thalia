import * as React from "react";
import Web3Modal from "web3modal";
import { providers, Signer } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";

interface Context {
    openModal: () => void;
    signOut: () => void;
    attemptLogin: () => void;
    signer?: providers.JsonRpcSigner;
    address?: string;
}
export const AppContext = React.createContext<Context>({
    openModal: () => {},
    signOut: () => {},
    attemptLogin: () => {},
    signer: undefined,
    address: "",
});

export const AppContextProvider = (props: any) => {
    const [signer, setSigner] = React.useState<providers.JsonRpcSigner | undefined>(undefined);
    const [address, setAddress] = React.useState<string | undefined>(undefined);
    const openModal = async () => {
        const providerOptions = {
            walletconnect: {
                package: WalletConnectProvider,
                options: {
                    rpc: {
                        1: "https://polygon-mumbai.g.alchemy.com/v2/2R-2HEUpjxVwsi_yS5GEC4kIYTgPc9mw",
                    },
                },
            },
        };
        const web3Modal = new Web3Modal({
            network: "", // optional
            cacheProvider: false, // optional
            providerOptions, // required
        });
        web3Modal.clearCachedProvider();
        const provider = new providers.Web3Provider(await web3Modal.connect());
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
            }}
        >
            <>{props.children}</>
        </AppContext.Provider>
    );
};

export function useAppContext() {
    return React.useContext(AppContext);
}
