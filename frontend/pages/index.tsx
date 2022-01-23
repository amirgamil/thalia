import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Playground } from "../components/playground";
import { Provider } from "wagmi";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Thalia</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className="text-xl">Thalia</h1>
                <p>On-chain music composition. Compose with the masses. Build beautiful tunes together.</p>
                <Provider>
                    <Playground />
                </Provider>
            </main>
        </div>
    );
};

export default Home;
