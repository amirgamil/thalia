import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AppContextProvider } from "../components/context";

import { WalletLinkConnector } from "wagmi/connectors/walletLink";
import { defaultChains, InjectedConnector, Provider, chain } from "wagmi";

const connectors = ({ chainId }: { chainId: number }) => {
    const rpcUrl = `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
    return [
        new WalletLinkConnector({
            options: {
                appName: "Thalia",
                jsonRpcUrl: rpcUrl,
            },
        }),
        new InjectedConnector({ chains: defaultChains }),
    ];
};
function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Provider autoConnect connectors={connectors}>
            <AppContextProvider>
                <Component {...pageProps} />
            </AppContextProvider>
        </Provider>
    );
}

export default MyApp;
