import * as React from "react";
import Head from "next/head";
import { Playground } from "../components/playground";
import styles from "../styles/Home.module.css";
import { Nav } from "../components/nav";
import { Footer } from "../components/footer";
import { Button } from "../components/button";
import { useAppContext } from "../components/context";
import toast, { Toaster } from "react-hot-toast";
import { CHAIN_EXPLORER } from "../lib/defaults";
import { createByteArrFromString } from "../lib/byteArrHelpers";

export const CreateSong: React.FC<{ notes?: string; defaultBPM?: string }> = ({
    notes,
    defaultBPM,
}: {
    notes?: string;
    defaultBPM?: string;
}) => {
    const [name, setName] = React.useState<string>("");
    const [bpm, setBpm] = React.useState<string>(defaultBPM ?? "");
    const [rawSongNotes, setRawSongNotes] = React.useState<string>(notes ?? "");
    const context = useAppContext();

    const updateSongCallback = (notes: string) => {
        //callback passed into the Playground to get the music notes
        setRawSongNotes(notes);
    };

    const createNewSong = async () => {
        const provider = context.provider;
        const signer = context.signer;
        const contract = context.contract;
        if (provider && signer && contract) {
            const contractWithSigner = contract.connect(signer);

            let res: any;
            let id: number;

            if (rawSongNotes.length !== 0) {
                id = await contractWithSigner.callStatic.createNewSongWithNotes(
                    name,
                    bpm,
                    createByteArrFromString(rawSongNotes)
                );
                res = await contractWithSigner.createNewSongWithNotes(name, bpm, createByteArrFromString(rawSongNotes));
            } else {
                id = await contractWithSigner.callStatic.createNewSong(name, bpm);
                res = await contractWithSigner.createNewSong(name, bpm);
            }

            toast.custom(
                (t) => (
                    <div className={`bg-white px-6 py-4 shadow-md ${t.visible ? "animate-enter" : "animate-leave"}`}>
                        <a className="underline" href={`${CHAIN_EXPLORER}tx/${res.hash}`}>
                            Transaction
                        </a>{" "}
                        broadcasted! If the Tx succeeds, it will live{" "}
                        <a
                            className="underline"
                            href={
                                process.env.NODE_ENV === "development"
                                    ? `http://localhost:3000/song?id=${id}`
                                    : `http://`
                            }
                        >
                            here
                        </a>
                    </div>
                ),
                { position: "top-center", duration: 10000 }
            );
            console.log("executed create new song: ", res);
        } else {
            console.error("Could not verify provider or signer or contract");
        }
    };

    const numericBpm = parseInt(bpm) ? parseInt(bpm) : 110;
    if (bpm && !parseInt(bpm)) {
        toast("Uh oh, bpm should be a number!");
    }

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
                    <h1 className="text-xl font-bold">It &apos;s only you and the music.</h1>
                    <p className="text-s opacity-70">
                        Create a song.<br></br>Write some notes.<br></br>Commit them to the blockchain.<br></br>Now
                        anyone can add to this song.<br></br>I can&apos;t wait to see to what you create.
                    </p>
                </div>
                <div className="flex flex-col">
                    <input
                        className="text-s py-4"
                        placeholder={"Name?"}
                        value={name}
                        onChange={(evt) => setName(evt.target.value)}
                    />
                    <input
                        className="text-s py-4"
                        placeholder={"Beats Per Minute? Larger number = faster music"}
                        value={bpm}
                        onChange={(evt) => setBpm(evt.target.value)}
                    />
                </div>
                <Playground
                    isLoading={false}
                    prevMusicNotes={""}
                    rawNotes={rawSongNotes}
                    updateSongCallback={updateSongCallback}
                    bpm={numericBpm}
                />
                <Button onClick={createNewSong}>Create</Button>
                <Footer />
                <Toaster />
            </main>
        </div>
    );
};

export default CreateSong;
