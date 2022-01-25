import Link from "next/link";
import router from "next/router";
import * as React from "react";
import { useConnect } from "wagmi";
import { useAppContext } from "./context";

export const Wallet: React.FC = () => {
    const [{ data, error }, connect] = useConnect();
    const context = useAppContext();
    return (
        <div>
            {data.connectors.map((x) => (
                <button disabled={!x.ready} key={x.id} onClick={() => connect(x)}>
                    {x.name}
                    {!x.ready && " (unsupported)"}
                </button>
            ))}

            {error && <div>{error?.message ?? "Failed to connect"}</div>}
        </div>
    );
};
