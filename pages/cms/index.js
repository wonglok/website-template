import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { SDK } from '../../your-cms/api'

export function CMSApp () {
  return (
    <div>
      aaaa
    </div>
  )
}

export default function CMSLandingPage () {
  const router = useRouter()
  useEffect(() => {
    if (!SDK.isLoggedIn) {
      router.push({
        pathname: '/cms/login',
        query: {
          // q: query
        }
      })
    } else {
      // router.push({
      //   pathname: '/cms/app',
      //   query: {
      //     // q: query
      //   }
      // })
    }
  })
  return (
    <div>
      <Head>
        <title>86deck</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CMSApp></CMSApp>
    </div>
  )
}
