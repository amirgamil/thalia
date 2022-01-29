import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AppContextProvider } from "../components/context";

import { WalletLinkConnector } from "wagmi/connectors/walletLink";
import { defaultChains, InjectedConnector, Provider, chain } from "wagmi";
import { QueryClient, QueryClientProvider } from "react-query";

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

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Provider autoConnect connectors={connectors}>
            <QueryClientProvider client={queryClient}>
                <AppContextProvider>
                    <Component {...pageProps} />
                </AppContextProvider>
            </QueryClientProvider>
        </Provider>
    );
}

export default MyApp;
