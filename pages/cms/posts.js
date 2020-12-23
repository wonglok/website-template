import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { SDK } from '../../your-cms/api'
import { CMSLayout } from '../../your-cms/CMSLayout'

export function CMSApp () {
  const router = useRouter()
  return (
    <div>
      <CMSLayout cta={'Create a Post'} onClickCTA={() => {}}>
        <h2 className="my-4 mt-6 text-4xl font-semibold dark:text-gray-400">
          Posts
        </h2>
        <div>
          123
        </div>
      </CMSLayout>
    </div>
  )
}

export default function CMSLandingPage () {
  const router = useRouter()
  const [canShow, setCanShow] = useState(false)
  useEffect(() => {
    if (!SDK.isLoggedIn) {
      setCanShow(false)
      router.push('/cms/login')
    } else {
      setCanShow(true)
    }
  })

  return (
    <div>
      <Head>
        <title>86deck</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/fav/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/fav/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/fav/favicon-16x16.png" />
        <link rel="icon" href="/fav/favicon.ico" />
      </Head>
      {
        canShow ? <CMSApp></CMSApp> : <div className="h-screen w-full flex items-center justify-center">You Need to login</div>
      }
    </div>
  )
}
