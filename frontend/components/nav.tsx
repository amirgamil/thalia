import Link from "next/link";
import router from "next/router";
import * as React from "react";
import { useAppContext } from "./context";
import { useAccount, useConnect } from "wagmi";
import { Wallet } from "./wallet";

export const Nav = () => {
    const context = useAppContext();
    const [{ data: connectData, error: connectError }, connect] = useConnect();
    const [{ data: accountData }, disconnect] = useAccount({
        fetchEns: true,
    });
    const [showWalletConnect, setShowWalletConnect] = React.useState<boolean>(false);

    const goHome = () => {
        router.push("/");
    };

    return (
        <div style={{ background: "green !important" }} className="relative w-full">
            <div style={{ zIndex: 40, background: "brown" }} className="relative w-full pt-8 h-26 flex text-white">
                <div className="ml-auto my-auto mr-16">
                    {accountData && (
                        <>
                            <Link href={`/tune?id=`}>
                                <a className="button secondary mr-4">Find Tune</a>
                            </Link>
                            <Link href={`/explore`}>
                                <a className="button secondary mr-4">Explore</a>
                            </Link>
                            <button className="my-auto cursor-pointer secondary mr-4" onClick={disconnect}>
                                Sign Out
                            </button>
                        </>
                    )}
                    <button
                        className="cursor-pointer z-40"
                        onClick={() => {
                            if (context.address) {
                                goHome();
                            } else {
                                setShowWalletConnect(true);
                            }
                        }}
                    >
                        {accountData ? `${accountData.address.slice(0, 8).toLowerCase()}...` : "Sign In"}
                    </button>
                    {showWalletConnect && <Wallet />}
                </div>
            </div>
        </div>
    );
};
