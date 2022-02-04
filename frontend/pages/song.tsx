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
import toast, { Toaster } from "react-hot-toast";
import { createByteArrFromString, getStringFromByteArray } from "../lib/byteArrHelpers";
import { cloneDeep } from "lodash";
import { mapArrToSong, Song } from "../lib/musicHelpers";
import { Spinner } from "../components/spinner";
import { CHAIN_EXPLORER } from "../lib/defaults";

interface NotesRecord {
    oldNotes: string;
    //currentNotes is oldNotes + whatever is added
    currentNotes: string;
}

const SongPage: NextPage = () => {
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

    const deleteSong = async () => {
        const provider = context.provider;
        const signer = context.signer;
        const contract = context.contract;
        if (provider && signer && contract) {
            const contractWithSigner = contract.connect(signer);
            setIsUpdating(true);
            try {
                const txData = await contractWithSigner.deleteSong(id);
                broadcastTransaction(txData.hash);
            } catch (ex: unknown) {
                toast.error("Uh oh, an error occurred broadcasting the transaction :(", {
                    position: "top-center",
                });
                setIsUpdating(false);
            }
        }
    };

    const broadcastTransaction = (hash: string) => {
        toast.custom(
            (t) => (
                <div className={`bg-white px-6 py-4 shadow-md ${t.visible ? "animate-enter" : "animate-leave"}`}>
                    Transaction broadcasted! View it{" "}
                    <a className="underline" href={`${CHAIN_EXPLORER}tx/${hash}`}>
                        here
                    </a>
                </div>
            ),
            { position: "top-center" }
        );
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
                    broadcastTransaction(txData.hash);
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
                        <Spinner />
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
                <meta name="description" content="On-chain music composition" />
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
                        <div className="flex">
                            <Button onClick={updateSong}>Commit to the chain</Button>
                            <Button onClick={deleteSong}>Delete (you must be the owner!)</Button>
                        </div>
                    </>
                )}
                <Toaster />
                <Footer />
            </main>
        </div>
    );
};

export default SongPage;
