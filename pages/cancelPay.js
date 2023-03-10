import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Navbar } from '../Component/bar'
import Link from 'next/link'
import { CancelToBuy } from '../Component/alerts'

export default function CancelPay(){
    return(
        <div className={styles.container}>
            <Head>
                <title>Cancel Pay</title>
                <meta name="description" content="ERROR FOR PROCCESSING DATA, TRY AGAIN" />
                <link rel="icon" href="/favicon.ico" />
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossOrigin="anonymous"></link>
            </Head>

            <main className={styles.main}>
                <Navbar />
                <CancelToBuy />
            </main>

            <footer className={styles.footer}>
                <Link
                href="https://github.com/Aguilera2509"
                target="_blank"
                rel="noopener noreferrer"
                >
                Created by{' '}
                <span className={styles.logo}>
                Aguilera Jose
                </span>
                </Link>
            </footer>
        </div>
    )
}