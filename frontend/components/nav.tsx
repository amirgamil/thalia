import Link from "next/link";
import router from "next/router";
import * as React from "react";
import { useAppContext } from "./context";

export const Nav = () => {
    const context = useAppContext();

    const goHome = () => {
        router.push("/");
    };

    return (
        <div className="relative w-full">
            <div className="relative w-full pt-8 h-26 flex text-white">
                <div className="ml-auto my-auto mr-16">
                    {context.address && (
                        <>
                            <Link href={`/tune?id=`}>
                                <a className="button secondary mr-4">Find Tune</a>
                            </Link>
                            <Link href={`/explore`}>
                                <a className="button secondary mr-4">Explore</a>
                            </Link>
                            <Link href={`/create`}>
                                <a className="button secondary mr-4">Create</a>
                            </Link>
                            <button className="my-auto cursor-pointer secondary mr-4" onClick={context.signOut}>
                                Sign Out
                            </button>
                        </>
                    )}
                    <button
                        className="cursor-pointer"
                        onClick={() => {
                            if (context.address) {
                                goHome();
                            } else {
                                context.openModal();
                            }
                        }}
                    >
                        {context.address ? `${context.address.slice(0, 8).toLowerCase()}...` : "Sign In"}
                    </button>
                </div>
            </div>
        </div>
    );
};
