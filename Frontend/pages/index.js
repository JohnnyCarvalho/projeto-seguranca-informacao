import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Segurança da Informação</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.grid}>
          <a href="register" className={styles.card}>
            <h2>Registrar Usuário &rarr;</h2>
          </a>          
          <a href="login" className={styles.card}>
            <h2>Autenticar Usuário &rarr;</h2>
          </a>          
        </div>
      </main>
    </div>
  )
}
