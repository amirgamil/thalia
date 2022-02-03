import type { NextPage } from "next";
import * as React from "react";
import Head from "next/head";
import { Playground } from "../components/playground";
import styles from "../styles/Home.module.css";
import { Nav } from "../components/nav";
import { Footer } from "../components/footer";
import { Button } from "../components/button";
import { useAppContext } from "../components/context";
import { Toaster } from "react-hot-toast";
import styled from "styled-components";
import { useQuery } from "react-query";
import { mapArrToSong, Song } from "../lib/musicHelpers";
import { Spinner } from "../components/spinner";
import { SongField } from "../components/songField";

const Container = styled.div`
    margin-top: 100px;
    input {
        border: 1px solid rgb(0, 0, 0, 0.4);
        width: 35vw;
    }
`;

const FindPage: NextPage = () => {
    const [name, setName] = React.useState<string>("");
    const context = useAppContext();

    const contactsExists = context.contract !== undefined;

    const { data, isLoading, error } = useQuery<Song[]>(
        "allSongs",
        async () => {
            if (context.contract) {
                const dataResult = await context.contract.getAllSongs();
                return dataResult.map(mapArrToSong);
            }
        },
        { retry: 10, enabled: contactsExists }
    );

    const filteredResults = data?.filter((el) => el.name.includes(name));

    return (
        <div className={styles.container}>
            <Head>
                <title>Thalia</title>
                <meta name="description" content="On-chain music composition" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Nav />
            <main className={styles.main}>
                <Container className="flex flex-col items-center justify-center w-full">
                    <input
                        className="p-4"
                        placeholder="Search for the name of a song here"
                        value={name}
                        onChange={(evt) => setName(evt.target.value)}
                    />

                    <div className="flex flex-col items-center justify-center my-7">
                        {isLoading ? (
                            <Spinner />
                        ) : (
                            filteredResults?.map((el, i) => <SongField key={i} name={el.name} id={el.id} />)
                        )}
                    </div>
                </Container>
                <Footer />
                <Toaster />
            </main>
        </div>
    );
};

export default FindPage;
