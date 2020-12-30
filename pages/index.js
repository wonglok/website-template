import Head from 'next/head'
import { DeckCTA } from '../pages-gui/DeckCTA'
import { DeckMainArt } from '../pages-gui/DeckMainArt'

import { ChurchCanvas } from '../your-3d/church/ChurchCanvas'
import { FighterCanvas } from '../your-3d/character/FighterCanvas'

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
      {/* <DeckCTA></DeckCTA> */}

      <div className="flex max-w-7xl mx-auto mt-12">
        <div className={' w-1/3 mx-6 rounded-3xl overflow-hidden mb-6'} style={{ width: 400 + 'px', height: 400 * 1.618 + 'px' }}>
          <ChurchCanvas></ChurchCanvas>
        </div>
        <div className={' w-1/3 mx-6 rounded-3xl overflow-hidden mb-6'} style={{ width: 400 + 'px', height: 400 * 1.618 + 'px' }}>
          <FighterCanvas></FighterCanvas>
        </div>
      </div>

      <div className="h-96  "></div>
    </div>
  )
}
