import type { NextPage } from "next";
import * as React from "react";
import Head from "next/head";
import { Playground } from "../components/playground";
import styles from "../styles/Home.module.css";
import { Nav } from "../components/nav";
import { Footer } from "../components/footer";
import { Button } from "../components/button";
import { useAppContext } from "../components/context";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import toast, { ToastBar, Toaster } from "react-hot-toast";
import { createByteArrFromString, getStringFromByteArray } from "../lib/byteArrHelpers";
import { cloneDeep } from "lodash";

interface Song {
    name: string;
    bpm: number;
    id: number;
    //Returns an array of byte32 strings
    notes: string[];
    isDeleted: boolean;
    isMinted: boolean;
}

const mapArrToSong = (arr: any[]): Song => {
    const song: any = {};

    if (typeof arr[0] === "string") {
        song.name = arr[0];
    }

    if (typeof arr[1] === "boolean") {
        song.isMinted = arr[1];
    }

    if (typeof arr[2] === "boolean") {
        song.isDeleted = arr[2];
    }

    if (Array.isArray(arr[3])) {
        song.notes = arr[3];
    }

    if (typeof arr[4] === "number") {
        song.id = arr[4];
    }

    if (typeof arr[5] === "number") {
        song.bpm = arr[5];
    }

    return song as Song;
};

interface NotesRecord {
    oldNotes: string;
    //currentNotes is oldNotes + whatever is added
    currentNotes: string;
}

const CHAIN_EXPLORER = "https://polygonscan.com/";

const Song: NextPage = () => {
    const context = useAppContext();
    const router = useRouter();
    const { id } = router.query;

    const contractExists = context.contract !== undefined;

    const [writeTxHash, setWriteTxHash] = React.useState<string | undefined>(undefined);

    const { isLoading, error, data } = useQuery<Song | undefined>(
        "song",
        async () => {
            if (context.contract && id !== undefined) {
                const dataResult = await context.contract.getSongFromId(id);
                //return a tuple with all of the struct elements
                const result = mapArrToSong(dataResult);
                const musicNotes = getStringFromByteArray(result.notes);

                //new notes have been verified and committed on-chain (no longer in mempool);
                if (notesRecord.currentNotes === musicNotes && writeTxHash) {
                    setIsUpdating(false);
                    setWriteTxHash(undefined);
                    toast.success("Your notes are now part of the song!");
                }
                setNotesRecord({ oldNotes: musicNotes, currentNotes: musicNotes });

                return result;
            }
        },
        { retry: 10, enabled: contractExists }
    );

    const rawStringFromBytes = data ? getStringFromByteArray(data.notes) : "";

    //on load, user hasn't added anything and oldNotes = currentNotes
    const [notesRecord, setNotesRecord] = React.useState<NotesRecord>(
        data ? { oldNotes: rawStringFromBytes, currentNotes: rawStringFromBytes } : { oldNotes: "", currentNotes: "" }
    );
    const [isUpdating, setIsUpdating] = React.useState<boolean>(false);

    const updateSongCallback = (notes: string) => {
        const copyNotes = cloneDeep(notesRecord);
        copyNotes.currentNotes = notes;
        setNotesRecord(copyNotes);
    };

    const updateSong = async () => {
        const provider = context.provider;
        const signer = context.signer;
        const contract = context.contract;
        if (provider && signer && contract && data) {
            const contractWithSigner = contract.connect(signer);
            const newNotes = createByteArrFromString(notesRecord.currentNotes.substring(notesRecord.oldNotes.length));

            if (newNotes) {
                setIsUpdating(true);
                try {
                    const txData = await contractWithSigner.addNotes(id, newNotes);
                    setWriteTxHash(txData.hash);

                    toast.custom(
                        (t) => (
                            <div
                                className={`bg-white px-6 py-4 shadow-md ${
                                    t.visible ? "animate-enter" : "animate-leave"
                                }`}
                            >
                                Transaction broadcasted! View it{" "}
                                <a className="underline" href={`${CHAIN_EXPLORER}/${txData.hash}`}>
                                    here
                                </a>
                            </div>
                        ),
                        { position: "top-center" }
                    );
                } catch (ex: unknown) {
                    toast.error("Uh oh, an error occurred broadcasting the transaction :(", {
                        position: "top-center",
                    });
                    setIsUpdating(false);
                }
            } else {
                toast("Uh oh, add some notes by typing something before you can commit", { position: "top-center" });
            }
        } else {
            console.error("Could not verify provider or signer or contract");
        }
    };

    console.log(isLoading, error, data);

    if (error) {
        return (
            <div className={styles.container}>
                <main className={styles.main}>
                    <div className="w-full h-full flex items-center justify-center">
                        <p className="opacity-50">A song is waiting to be created here...</p>
                    </div>
                    <Footer />
                </main>
            </div>
        );
    }

    //FIXME: prompt to sign in with wallet if not signed in instead of just showing loading screen
    if (isLoading || !context.contract || !data) {
        return (
            <div className={styles.container}>
                <main className={styles.main}>
                    <div className="w-full h-full flex items-center justify-center">
                        <p className="opacity-50">loading...</p>
                    </div>
                    <Footer />
                </main>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Thalia</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Nav />
            <main className={styles.main}>
                <div className="py-4">
                    <h1 className="text-xl font-bold">{data.name}</h1>
                    <h3>BPM: {data.bpm}</h3>
                </div>
                {data.isDeleted ? (
                    <p>This song was sadly deleted :(</p>
                ) : (
                    <>
                        <Playground
                            isLoading={isUpdating}
                            prevMusicNotes={notesRecord.oldNotes}
                            rawNotes={notesRecord.currentNotes}
                            updateSongCallback={updateSongCallback}
                            bpm={data.bpm}
                        />
                        <Button onClick={updateSong}>Commit to the chain</Button>
                    </>
                )}
                <Toaster />
                <Footer />
            </main>
        </div>
    );
};

export default Song;
