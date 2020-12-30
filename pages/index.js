import Head from 'next/head'
import { DeckCTA } from '../pages-gui/DeckCTA'
import { DeckMainArt } from '../pages-gui/DeckMainArt'
export default function Home() {
  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/fav/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/fav/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/fav/favicon-16x16.png" />
        <link rel="icon" href="/fav/favicon.ico" />
      </Head>

      <DeckMainArt></DeckMainArt>
      <DeckCTA></DeckCTA>
    </div>
  )
}
