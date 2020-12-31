import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { SDK } from '../../pages-cms-gui/api'
import { CMSLayout } from '../../pages-cms-gui/CMSLayout'
// import { ChurchCanvas } from '../../your-3d/church/ChurchCanvas'
// import { FighterCanvas } from '../../your-3d/character/FighterCanvas'

export function CMSApp () {
  // const router = useRouter()
  return (
    <div>
      <CMSLayout>
        <h2 className="my-4 mt-6 text-4xl font-semibold dark:text-gray-400">
          Welcome to CMS
        </h2>
        <div className="flex">
          {/* <div className={' w-1/3 mr-6 rounded-3xl overflow-hidden mb-6'} style={{ width: 400 + 'px', height: 400 * 1.618 + 'px' }}>
            <ChurchCanvas></ChurchCanvas>
          </div> */}
          {/* <div className={' w-1/3 mr-6 rounded-3xl overflow-hidden mb-6'} style={{ width: 400 + 'px', height: 400 * 1.618 + 'px' }}>
            <FighterCanvas></FighterCanvas>
          </div> */}
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
        <title>CMS</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/fav/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/fav/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/fav/favicon-16x16.png" />
        <link rel="icon" href="/fav/favicon.ico" />
      </Head>

      {
        canShow ? <CMSApp></CMSApp> : <div className="h-screen w-full flex items-center justify-center">Checking Login</div>
      }
    </div>
  )
}
