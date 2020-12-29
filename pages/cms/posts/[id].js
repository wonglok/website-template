import { useEffect, useState, useRef, useMemo, Suspense } from 'react'
import { CMSLayout } from "../../../pages-cms-gui/CMSLayout"
import { SDK, Posts } from "../../../pages-cms-gui/api"
import { useRouter } from 'next/router'
import Head from 'next/head'
import create from 'zustand'
import { TextEdit } from '../../../pages-cms-gui/TextEdit'

export const usePost = create((set, get) => {
  function mySaveChecker (e) {
    // Cancel the event
    e.preventDefault() // If you prevent default behavior in Mozilla Firefox prompt will always be shown
    // Chrome requires returnValue to be set
    e.returnValue = ''

    return 'Needs save file'
  }

  return {
    msg: '',
    post: false,
    dirty: false,
    resetPost: () => {
      set({ post: false, msg: '', dirty: false })
    },
    setPost: ({ post }) => {
      window.onbeforeunload = mySaveChecker
      set({ post: JSON.parse(JSON.stringify(post)), dirty: true })
    },
    loadPost: async ({ _id }) => {
      let val = await Posts.findOneMine({ query: { _id } })
      set({ post: val, msg: '', dirty: false })
    },
    savePost: async ({ post }) => {
      window.onbeforeunload = undefined
      delete window.onbeforeunload

      await Posts.updateMine({ doc: post })
        .then((post) => {
          set({ post, msg: '', dirty: false })
        }, (err) => {
          if ((err + '').toLowerCase().indexOf('dup key') !== -1) {
            set({ msg: 'url is taken' })
          }
        })
    }
  }
})

export function InputField ({ value, onInput }) {
  const [input, syncInput] = useState(value)

  useEffect(() => {
    syncInput(value)
  }, [value])

  return <input type="text" value={input} onInput={e => {
    syncInput(e.target.value)
    onInput(e.target.value)
  }} className="p-1 px-2 m-1 bg-white"></input>
}

export function MDField ({ value, onInput }) {
  const [input, syncInput] = useState(value)

  useEffect(() => {
    syncInput(value)
  }, [value])

  return <textarea type="text" value={input} onInput={e => {
    syncInput(e.target.value)
    onInput(e.target.value)
  }} className="p-1 px-2 m-1 bg-white"></textarea>
}

export function TitleEdit () {
  const msg = usePost(s => s.msg)
  const post = usePost(s => s.post)
  const savePost = usePost(s => s.savePost)

  const onSubmit = () => {
    savePost({ post })
  }

  return post && (<form onSubmit={(e) => { e.preventDefault(); onSubmit() }}>
    <InputField value={post.displayName} onInput={v => { post.displayName = v; }}></InputField>
    <button
      className={`bg-${'blue'}-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1`}
      type="submit"
      style={{ transition: "all .15s ease" }}
      onClick={(e) => { onSubmit() }}
    >
      {'Update'}
    </button>
    {msg && <div>{msg}</div>}
    <div className="flex items-center">
      <div className="inline-block p-1 px-2 m-1 bg-white opacity-30">URL: <a target={`_${post._id}`} href={`${location.origin}/posts/${post.slug}`}>{location.origin}/posts/{post.slug}</a></div>
    </div>
  </form>)
}

export function MDEdit () {
  const post = usePost(s => s.post)
  const savePost = usePost(s => s.savePost)
  const setPost = usePost(s => s.setPost)
  const [text, setText] = useState('')
  const onSubmit = async () => {
    await savePost({ post })
  }

  const onUpdate = ({ text, html }) => {
    setText(text)
    setPost({
      post: {
        ...post,
        text
      }
    })
  }

  useEffect(() => {
    let onSave = (event) => {
      if ((event.key == 's' && event.ctrlKey || event.which == 83 && event.metaKey)) {
        event.preventDefault()
        setPost({
          post: {
            ...post,
            text
          }
        })
        savePost({ post })
      }
    }

    window.addEventListener('keydown', onSave, false)
    return () => {
      window.removeEventListener('keydown', onSave, false)
    }
  }, [])

  return post && (<form onSubmit={(e) => { e.preventDefault(); onSubmit() }}>
    {/* <div className={' text-xs text-gray-600 px-3 py-3'}>{saveStatus}</div> */}
    <div className={' text-xs text-gray-600 px-3 py-3'}>CTRL + S (PC), CMD + S (mac) to Save</div>
    {/* <MDField value={post.text || ''} onInput={v => { post.text = v; }}></MDField> */}
    <TextEdit value={post.text} onUpdate={onUpdate}></TextEdit>
    {/* <button
      className={`bg-${'blue'}-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1`}
      type="submit"
      style={{ transition: "all .15s ease" }}
      onClick={(e) => { onSubmit() }}
    >
      {'Update'}
    </button> */}
  </form>)
}

export function ItemEdit () {
  const router = useRouter()
  let post = usePost(s => s.post)
  let loadPost = usePost(s => s.loadPost)
  let resetPost = usePost(s => s.resetPost)

  useEffect(() => {
    resetPost()
    return () => {
      resetPost()
    }
  }, [])
  useEffect(() => {
    loadPost({ _id: router.query.id })
    return () => {
    }
  }, [])



  return (post && <div className={''}>
    <TitleEdit post={post}></TitleEdit>
    <MDEdit post={post}></MDEdit>
    {/* <pre>{JSON.stringify(post, null, '\t')}</pre> */}
  </div>)
}

export function CMSApp () {
  return (
    <div>
      <CMSLayout>
        <AdminArea>
          {<ItemEdit></ItemEdit>}
        </AdminArea>
      </CMSLayout>
    </div>
  )
}

export function AdminArea ({ children = <div></div> }) {
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
