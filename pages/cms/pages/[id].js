import { useEffect, useState, useRef, useMemo, Suspense } from 'react'
import { PageEditor } from "../../../your-cms/PageEditor"
import { CMSLayout } from "../../../your-cms/CMSLayout"
import { SDK, Pages } from "../../../your-cms/api"
import { useRouter } from 'next/router'
import Head from 'next/head'

export function PageEditorData () {
  const router = useRouter()
  const [page, setPage] = useState(false)
  const [changed, setChanged] = useState(false)

  useEffect(async () => {
    let pages = await Pages.filterMine({ filter: { _id: router.query.id } })
    pages = pages || []
    pages = pages.filter(e => e._id === router.query.id)

    // const str = await compress(str)

    if (pages[0]) {
      setPage(pages[0])
    }
  }, [router.query.id, page && page._id])

  let onSave = async (data) => {
    let cloned = JSON.parse(JSON.stringify(page))
    cloned.data = data
    await Pages.updateMine({ doc: cloned })
    console.log(cloned.data)
    setChanged(false)
  }

  let onLoadHook = (hook) => {
    hook(page)
  }

  let onExit = () => {
    if (changed) {
      if (window.confirm('exit?')) { router.push('/cms/pages') }
    } else {
      router.push('/cms/pages')
    }
  }

  let onChange = (data) => {
    console.log(data)
    setChanged(true)
  }

  return (page && <div>
    <div className="my-4 mt-6 text-4xl font-semibold dark:text-gray-400">
      Page: {page.displayName}
    </div>

    <div className={'mb-6'}>
      <div onClick={() => { onExit() }} className=" inline-block px-4 py-2 text-sm bg-white rounded-lg cursor-pointer mr-3">Back</div>
    </div>

    <Suspense fallback={null}>
      <PageEditor onChange={onChange} onLoadHook={onLoadHook} onSave={onSave}></PageEditor>
    </Suspense>
  </div>) || <div>Not Found</div>
}

export function CMSApp () {
  return (
    <div>
      <CMSLayout>
        <AdminArea>
          <PageEditorData></PageEditorData>
        </AdminArea>
      </CMSLayout>
    </div>
  )
}

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
    }
  }
  return result()
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
