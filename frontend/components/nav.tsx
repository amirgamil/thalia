import Link from "next/link";
import router from "next/router";
import * as React from "react";
import styled from "styled-components";
import { useAppContext } from "./context";

const Container = styled.div`
    button:hover {
        opacity: 0.8;
    }
`;

export const Nav = () => {
    const context = useAppContext();

    const goHome = () => {
        router.push("/");
    };

    return (
        <div className="relative w-full opacity-50 z-40">
            <div className="relative w-full pt-8 h-26 flex text-white">
                <div className="ml-auto my-auto mr-16">
                    <Container>
                        {context.address && (
                            <>
                                <Link href={`/find`}>
                                    <button className="button secondary mr-4">Explore</button>
                                </Link>
                                <Link href={`/create`}>
                                    <button className="button secondary mr-4">Create</button>
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
                                    context.loadWeb3Modal();
                                }
                            }}
                        >
                            {context.address ? `${context.address.slice(0, 8).toLowerCase()}...` : "Sign In"}
                        </button>
                    </Container>
                </div>
            </div>
        </div>
    );
};
