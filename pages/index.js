import Head from 'next/head'
import { DeckCTA } from '../your-gui/DeckCTA'
import { DeckKeyVisual } from '../your-gui/DeckMainArt'
export default function Home() {
  return (
    <div>
      <Head>
        <title>86deck</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DeckKeyVisual></DeckKeyVisual>
      <DeckCTA></DeckCTA>
    </div>
  )
}
