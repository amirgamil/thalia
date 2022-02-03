import type { NextPage } from "next";
import * as React from "react";
import Head from "next/head";
import { Playground } from "../components/playground";
import styles from "../styles/Home.module.css";
import { Nav } from "../components/nav";
import { Footer } from "../components/footer";
import { Button } from "../components/button";

const Home: NextPage = () => {
    const [rawNotes, setRawNotes] = React.useState<string>("");

    const updateSongCallback = (newNotes: string) => {
        setRawNotes(newNotes);
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Thalia</title>
                <meta name="description" content="On-chain music composition" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Nav />
            <main className={styles.main}>
                <div className="py-4">
                    <h1 className="text-xl font-bold">Thalia.</h1>
                    <p className="text-xs opacity-50">
                        Tell stories with sound, text, and shapes all at once. Oh and it's on-chain.
                    </p>
                </div>
                <p className="opacity">
                    <strong>On-chain music composition</strong>.<br></br>Compose tunes with anyone and everyone{" "}
                    <strong>straight from your keyboard</strong>.
                </p>
                <Playground
                    isLoading={false}
                    prevMusicNotes={""}
                    updateSongCallback={updateSongCallback}
                    rawNotes={rawNotes}
                    bpm={140}
                />
                <div className="relative mt-auto pb-5">
                    <Button onClick={(evt) => console.log("TODO")}>Make this song!</Button>
                    <Footer />
                </div>
            </main>
        </div>
    );
};

export default Home;
