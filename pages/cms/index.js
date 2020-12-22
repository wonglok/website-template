import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { SDK } from '../../your-cms/api'
import { CMSLayout } from '../../your-cms/CMSLayout'

export function CMSApp () {
  const router = useRouter()
  return (
    <div>
      <CMSLayout cta={'Jump To Posts'} onClickCTA={() => { router.push('/cms/posts') }}>
        <h2 className="my-4 mt-6 text-4xl font-semibold dark:text-gray-400">
          Welcome to CMS
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
      router.push('/cms/login')
      setCanShow(false)
    } else {
      setCanShow(true)
    }
  })

  return (
    <div>
      <Head>
        <title>86deck</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {canShow ? <CMSApp></CMSApp> : null}
    </div>
  )
}
