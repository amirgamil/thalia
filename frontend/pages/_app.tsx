import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AppContextProvider } from "../components/context";

import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <AppContextProvider>
                <Component {...pageProps} />
            </AppContextProvider>
        </QueryClientProvider>
    );
}

export default MyApp;
