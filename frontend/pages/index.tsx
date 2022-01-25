import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Playground } from "../components/playground";
import styles from "../styles/Home.module.css";
import { Wallet } from "../components/wallet";
import { Nav } from "../components/nav";

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Thalia</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Nav />
            <main className={styles.main}>
                <h1 className="text-xl">Thalia</h1>
                <p>On-chain music composition. Build tunes with anyone. Oh and it's all on-chain.</p>
                <Wallet />
                <Playground />
            </main>
        </div>
    );
};

export default Home;
