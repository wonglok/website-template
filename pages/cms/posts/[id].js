import { useEffect, useState, useRef, useMemo, Suspense } from 'react'
import { CMSLayout } from "../../../pages-cms-gui/CMSLayout"
import { SDK, usePage } from "../../../pages-cms-gui/api"
import { useRouter } from 'next/router'
import Head from 'next/head'

export function AdminArea ({ children }) {
  const [canShow, setCanShow] = useState('wait')
  useMemo(async () => {
    try {
      let me = await SDK.getMe()
      if (me && me.isAdmin) {
        setCanShow('ok')
      } else {
        setCanShow('no')
      }
    } catch (e) {
      setCanShow('no')
      console.log(e)
    }

    return () => {
    }
  }, [])

  let result = () => {
    if (canShow === 'wait') {
      return <div>Checking Security</div>
    } else if (canShow === 'ok') {
      return children
    } else if (canShow === 'no') {
      return <div>You dont have access right.</div>
    } else {
      return <div></div>
    }
  }
  return result()
}


export function CMSApp () {
  const router = useRouter()
  return (
    <div>
      <CMSLayout>
        <AdminArea>
          <div>
            {router.query.id}
          </div>
        </AdminArea>
      </CMSLayout>
    </div>
  )
}

export default function PageEditorLanding () {
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
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </Head>
      {
        canShow ? <CMSApp></CMSApp> : <div className="h-screen w-full flex items-center justify-center">Checking Login</div>
      }
    </div>
  )
}
