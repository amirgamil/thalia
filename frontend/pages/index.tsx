import type { NextPage } from "next";
import * as React from "react";
import Head from "next/head";
import { Playground } from "../components/playground";
import styles from "../styles/Home.module.css";
import { Nav } from "../components/nav";
import { Footer } from "../components/footer";
import { Button } from "../components/button";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

const Home: NextPage = () => {
    const [rawNotes, setRawNotes] = React.useState<string>("");
    const router = useRouter();

    const updateSongCallback = (newNotes: string) => {
        setRawNotes(newNotes);
    };

    const prepareToMakeSong = () => {
        if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(rawNotes);
            toast(
                "Your song has been copied to your clipboard! You'll be redirected to the create page, paste the result there",
                {
                    duration: 4000,
                }
            );
            setTimeout(() => {
                router.push("/create");
            }, 4000);
        }
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
                    <h1 className="text-xl font-bold">🎵 Thalia Playground</h1>
                    <p className="text-xs opacity-50">
                        Tell stories with sound, text, and shapes all at once. Oh and it&apos;s all on-chain.
                    </p>
                </div>
                <p>
                    <strong>On-chain music composition</strong>.<br></br>Compose tunes with anyone and everyone{" "}
                    <strong>straight from your keyboard</strong>.
                </p>
                <Playground
                    isLoading={false}
                    prevMusicNotes={""}
                    updateSongCallback={updateSongCallback}
                    rawNotes={rawNotes}
                    bpm={150}
                />
                <div className="relative mt-auto pb-5">
                    <Button onClick={(evt) => prepareToMakeSong()}>Make this song!</Button>
                    <Footer />
                </div>
                <Toaster />
            </main>
        </div>
    );
};

export default Home;
