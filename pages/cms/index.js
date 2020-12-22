import Head from 'next/head'

import { LoginSection } from '../../your-cms/LoginSection'
export default function CMSLandingPage () {
  return (
    <div>
      <Head>
        <title>86deck</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoginSection></LoginSection>
    </div>
  )
}
