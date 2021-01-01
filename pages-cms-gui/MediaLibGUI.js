import { useRouter } from "next/router"
import { useEffect, useMemo, useRef, useState } from "react"
import create from "zustand"
import cx from 'classnames'
import { Folders, Media, uploadImageToCloudinary } from './api'
import Link from "next/link"
// import NextCloudinaryImage from "./NextCloudinary"

export const EMPTY_FOLDER = `/gui-assets/gallery/folder.jpg`
export const CREATE_FOLDER = `/gui-assets/gallery/create.jpg`
export const UPLOAD_ITEM = `/gui-assets/gallery/upload.jpg`

export const useFolders = create((set, get) => {
  return {
    folders: [],
    onArrive: async () => {
      set({ folders: [] })
      let folders = await Folders.adminListAll()
      set({ folders })
    },
    removeFolder: async ({ folder }) => {
      await Folders.adminDelete({ doc: folder })
      let folders = await Folders.adminListAll()
      set({ folders })
    },
    addFolder: async ({ displayName }) => {
      await Folders.create({ doc: { displayName } })
      let folders = await Folders.adminListAll()
      set({ folders })
    },
    updateTitle: async ({ _id, displayName }) => {
      await Folders.adminUpdate({ doc: { _id, displayName } })
    }
  }
})

export const useMedia = create((set, get) => {
  return {
    mediaItems: [],
    uploadImage: async ({ file, folderID }) => {
      let res = await uploadImageToCloudinary({ inputFile: file })
      await Media.create({ doc: { folderID, text: res.filename, cloudinary: res } })
      let mediaItems = await Media.adminFilter({ filter: { folderID } })
      set({ mediaItems })
    },
    onArrive: async ({ folderID }) => {
      set({ mediaItems: [] })
      let mediaItems = await Media.adminFilter({ filter: { folderID } })
      console.log(folderID, mediaItems)
      set({ mediaItems })
    },
    removeMedia: async ({ folderID, item }) => {
      await Media.adminDelete({ doc: item })
      let mediaItems = await Media.adminFilter({ filter: { folderID } })
      set({ mediaItems })
    },
    updateText: async ({ _id, text }) => {
      await Media.adminUpdate({ doc: { _id, text } })
    }
  }
})

export const AddFolderItem = () => {
  const [displayName, setDisplayName] = useState('My New Folder Title')
  const [msg, setMsg] = useState('')
  const addFolder = useFolders(s => s.addFolder)
  const onClick = async ({ displayName }) => {
    try {
      setMsg('')
      await addFolder({ displayName }).catch(e => {
        setMsg('Folder name is taken')
      })
      setDisplayName('My New Folder Title')
    } catch (e) {
      setMsg('Folder name is taken')
    }
  }

  return <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
    <div className="flex items-end justify-end h-56 w-full bg-cover bg-center" style={{ backgroundImage: `url(${CREATE_FOLDER})` }}>
      <button onClick={() => onClick({ displayName })} className="p-4 rounded-full bg-yellow-400 text-white mx-5 -mb-4 hover:bg-yellow-500 focus:outline-none">
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M11 11v-11h1v11h11v1h-11v11h-1v-11h-11v-1h11z"/></svg>
      </button>
    </div>

    <div className="px-5 py-3">
      <form onSubmit={(e) => {
        e.preventDefault();
        onClick({ displayName });
      }}>
        <input className="text-gray-700 bg-transparent outline-none" value={displayName} type="text" onInput={e => setDisplayName(e.target.value)} placeholder="My New Folder Title" />
      </form>
      <div className={'flex flex-col'}>
        {msg && <div className="mt-2 text-xs text-red-600 block">{msg}</div>}
        <div className="text-gray-500 mt-2 text-xs inline-block">Let's name your new folder.</div>
        {/* <input type={'text'} className="text-gray-500 mt-2 underline text-xs " value={'My New Folder Title'} /> */}
      </div>
    </div>
  </div>
}

export const FolderItem = ({ onPick = () => {}, folder = { displayName: 'My Folder', count: 0 } }) => {
  const updateTitle = useFolders(s => s.updateTitle)
  const removeFolder = useFolders(s => s.removeFolder)
  const [displayName, setDisplayName] = useState(folder.displayName)
  const [mode, setMode] = useState('view')

  let displayDesc = `Folder`
  if (folder.count === 0) {
    displayDesc =  `Empty Folder, Let's fill it up!`
  }

  return <div className=" group w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
    <div className="flex relative items-end justify-end h-56 w-full bg-cover bg-center"  style={{ backgroundImage: `url(${EMPTY_FOLDER})` }}>
      <div onClick={async () => {
        if (window.prompt(folder.slug + ' remove ____ to delte', folder.slug + '____') === folder.slug) {
          await removeFolder({ folder })
        }
      }} className="absolute top-0 right-0 py-3 mr-3 text-shadow">
        <svg className="opacity-0 group-hover:opacity-100 rounded-full focus:outline-none" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path fill="red" d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 10.293l5.293-5.293.707.707-5.293 5.293 5.293 5.293-.707.707-5.293-5.293-5.293 5.293-.707-.707 5.293-5.293-5.293-5.293.707-.707 5.293 5.293z"/></svg>
      </div>
      <button onClick={() => onPick({ item: folder })} className="p-4 rounded-full bg-green-400 text-white mx-5 -mb-4 hover:bg-green-500 focus:outline-none">
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path fill="white" d="M11 5h13v17h-24v-20h8l3 3zm-10-2v18h22v-15h-12.414l-3-3h-6.586z"/></svg>
      </button>
    </div>
    <div className="px-5 py-3">
      <input className="text-gray-700 block bg-transparent" type="text" value={displayName} onInput={e => {setDisplayName(e.target.value); setMode('save')}} />
      {mode === 'view' && <span className="text-gray-500 mt-2 text-xs">{displayDesc}</span>}
      {mode === 'save' && <span className="text-green-500 mt-2 text-xs underline" onClick={async () => { await updateTitle({ _id: folder._id, displayName: displayName }); setMode('view') }}>Click this to update title</span>}
    </div>
  </div>
}

export const GetFolders = ({ folders, onPick = false, router }) => {
  return folders.map(e => <FolderItem key={e._id} onPick={() => { onPick ? onPick({ folderID: e._id }) : router.push(`/cms/folder/${e._id}`) }} folder={e}></FolderItem>)
}

export const FolderLibGUI = ({ onPick }) => {
  const router = useRouter()
  const folders = useFolders(s => s.folders)
  const onArrive = useFolders(s => s.onArrive)
  useEffect(() => {
    onArrive()
  }, [router.query.id])
  const folderCount = folders.length || 0

  return <>
    <div className={""}>
      {/* <h3 className="text-gray-700 text-2xl font-medium">Browse Folders</h3> */}
      <span className="mt-3 text-sm algin-middle text-gray-500">{folderCount}<span className={'text-xs algin-middle'}>+</span> Folders</span>
      <div className={'grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6'}>
        <AddFolderItem></AddFolderItem>
        {GetFolders({ onPick, folders, router })}
      </div>
    </div>
  </>
}

export const UploadMediaItem = () => {
  const router = useRouter()
  const [msg, setMsg] = useState('')
  const uploadRef = useRef()
  const uploadImage = useMedia(s => s.uploadImage)

  const onUpload = async (evt) => {
    // let file = evt.target.files[0]
    let files = evt.target.files
    let count = 0
    for (let item of files) {
      count++
      setMsg(`Uploading ${count}/${files.length}`)
      await uploadImage({
        folderID: router.query.id,
        file: item
      })
    }
    setMsg(``)
  }

  return <div className="w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
    <div className="flex items-end justify-end h-56 w-full bg-cover bg-center" style={{ backgroundImage: `url(${UPLOAD_ITEM})` }}>
      <button onClick={() => {  uploadRef.current.click() }} className="p-4 rounded-full bg-yellow-400 text-white mx-5 -mb-4 hover:bg-yellow-500 focus:outline-none">
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M11 11v-11h1v11h11v1h-11v11h-1v-11h-11v-1h11z"/></svg>
      </button>
      <input ref={uploadRef} type={'file'} onChange={onUpload} multiple className={'hidden'} />
    </div>

    <div className="px-5 py-3">
      <form onSubmit={(e) => {
        e.preventDefault();
      }}>
        <input className="text-gray-700 bg-transparent outline-none" disabled value={'Select Image to Upload'} type="text" onInput={e => (e.target.value)} placeholder="My New Folder Title" />
      </form>
      <div className={'flex flex-col'}>
        {msg && <div className="mt-2 text-xs text-blue-600 block">{msg}</div>}
        <div className="text-gray-500 mt-2 text-xs inline-block">Let's share your photos.</div>
        {/* <input type={'text'} className="text-gray-500 mt-2 underline text-xs " value={'My New Folder Title'} /> */}
      </div>
    </div>
  </div>
}

export const MediaItem = ({ isPicker = false, onPickImage, item }) => {
  const copy2clip = require('copy-text-to-clipboard')
  const removeMedia = useMedia(s => s.removeMedia)
  const updateText = useMedia(s => s.updateText)

  const [displayName, setDisplayName] = useState(item.text)
  const [msg, setMsg] = useState('')
  const router = useRouter()
  const folderID = router.query.id
  const copy = (str, desc, type) => {
    if (type === 'tag') {
      return copy2clip(`\n<img src="${str}" alt="${desc}" title="${desc}" />\n`)
    } else if (type === 'link') {
      return copy2clip(`\n${str}\n`)
    }
  }

  const saveDisplayName = async () => {
    setMsg(`Saving....`)

    await updateText({ _id: item._id, text: displayName })

    setMsg(`Saved.`)
    setTimeout(() => {
      setMsg(`Saved..`)
    }, 1000 / 4 * 1)
    setTimeout(() => {
      setMsg(`Saved...`)
    }, 1000 / 4 * 2)
    setTimeout(() => {
      setMsg(`Saved...`)
    }, 1000 / 4 * 3)
    setTimeout(() => {
      setMsg(`Saved....`)
    }, 1000 / 4 * 4)
    setTimeout(() => {
      setMsg(``)
    }, 1000)
  }

  const [skip, canSkip] = useState(false)

  useEffect(() => {
    let onKeydown = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) {
        canSkip(true)
      } else {
        canSkip(false)
      }
    }
    let onKeyUp = (e) => {
      canSkip(false)
    }
    window.addEventListener('keydown', onKeydown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeydown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  const onRemoveItem = async () => {
    if (skip || window.confirm(`delete ${item.text} ?`)) {
      await removeMedia({ folderID, item })
      // await removeCloudianryImage({ media: item })
    }
  }

  return <div className="group relative w-full max-w-sm mx-auto rounded-md shadow-md overflow-hidden">
    <div className="flex items-end justify-end h-56 w-full bg-cover bg-center" style={{ backgroundImage: `url(${item.cloudinary.thumb})` }}>
      {/* <NextCloudinaryImage className={'absolute top-0 right-0 w-full h-56'} media={item}></NextCloudinaryImage> */}

      <div onClick={onRemoveItem} className="absolute top-0 right-0 py-3 mr-3 text-shadow ">
        <div className={`bg-red-500 p-1 rounded-full ${cx({ 'opacity-0': !skip, 'opacity-100': skip })} group-hover:opacity-100`}>
          {!skip && <svg className=" cursor-pointer rounded-full focus:outline-none" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path fill="white" d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm0 10.293l5.293-5.293.707.707-5.293 5.293 5.293 5.293-.707.707-5.293-5.293-5.293 5.293-.707-.707 5.293-5.293-5.293-5.293.707-.707 5.293 5.293z"/></svg>}
          {skip && <svg className=" cursor-pointer rounded-full focus:outline-none" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path fill="white" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.151 17.943l-4.143-4.102-4.117 4.159-1.833-1.833 4.104-4.157-4.162-4.119 1.833-1.833 4.155 4.102 4.106-4.16 1.849 1.849-4.1 4.141 4.157 4.104-1.849 1.849z"/></svg>}
        </div>
      </div>

      {skip && <div className="absolute top-0 right-0 mt-3 px-3 py-1 text-sm text-red-500 mr-12 text-shadow bg-white rounded-full">
        <span className={'select-none'}>Delete without confirm</span>
      </div>}

      {/* onPickImage */}
      {isPicker && <button target={`_${item._id}`} onClick={() => { onPickImage({ media: item }) }} className="p-4 rounded-full bg-blue-400 text-white mr-2 -mb-4 hover:bg-blue-500 focus:outline-none">
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path fill="white" d="M14 4h-13v18h20v-11h1v12h-22v-20h14v1zm10 5h-1v-6.293l-11.646 11.647-.708-.708 11.647-11.646h-6.293v-1h8v8z"/></svg>
      </button>}

      {!isPicker && <a target={`_${item._id}`} href={`${(item.cloudinary.auto)}`} className="p-4 rounded-full bg-blue-400 text-white mr-2 -mb-4 hover:bg-blue-500 focus:outline-none">
        <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path fill="white" d="M12.02 0c6.614.011 11.98 5.383 11.98 12 0 6.623-5.376 12-12 12-6.623 0-12-5.377-12-12 0-6.617 5.367-11.989 11.981-12h.039zm3.694 16h-7.427c.639 4.266 2.242 7 3.713 7 1.472 0 3.075-2.734 3.714-7m6.535 0h-5.523c-.426 2.985-1.321 5.402-2.485 6.771 3.669-.76 6.671-3.35 8.008-6.771m-14.974 0h-5.524c1.338 3.421 4.34 6.011 8.009 6.771-1.164-1.369-2.059-3.786-2.485-6.771m-.123-7h-5.736c-.331 1.166-.741 3.389 0 6h5.736c-.188-1.814-.215-3.925 0-6m8.691 0h-7.685c-.195 1.8-.225 3.927 0 6h7.685c.196-1.811.224-3.93 0-6m6.742 0h-5.736c.062.592.308 3.019 0 6h5.736c.741-2.612.331-4.835 0-6m-12.825-7.771c-3.669.76-6.671 3.35-8.009 6.771h5.524c.426-2.985 1.321-5.403 2.485-6.771m5.954 6.771c-.639-4.266-2.242-7-3.714-7-1.471 0-3.074 2.734-3.713 7h7.427zm-1.473-6.771c1.164 1.368 2.059 3.786 2.485 6.771h5.523c-1.337-3.421-4.339-6.011-8.008-6.771"/></svg>
        {/* <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path fill="black" d="M14 4h-13v18h20v-11h1v12h-22v-20h14v1zm10 5h-1v-6.293l-11.646 11.647-.708-.708 11.647-11.646h-6.293v-1h8v8z"/></svg> */}
      </a>}

    </div>

    <div className="px-5 py-3">
      <form onSubmit={(e) => {
        e.preventDefault();
      }}>
        <input className="text-gray-700 bg-transparent outline-none w-full" value={displayName} type="text" onInput={e => { setDisplayName(e.target.value); setMsg('Click here to save.'); }} placeholder={item.cloudinary.filename} />
      </form>

        {/* {msg && <div className="mt-2 text-xs text-red-600 block">{msg}</div>} */}
        {/* <input type={'text'} className="text-gray-500 mt-2 underline text-xs " value={'My New Folder Title'} /> */}

      <div className={'flex flex-row'}>
        {msg && <div onClick={saveDisplayName} className="mt-2 text-xs text-green-600 block underline">{msg}</div>}
      </div>

      <div className={'flex flex-row'}>
        <div className=" text-gray-500 mt-2 text-xs inline-block mr-3">Copy Link: </div>
        <div onClick={() => { copy(`${item.cloudinary.auto}`, displayName, 'link'); }} className=" cursor-pointer text-blue-500 mt-2 hover:text-blue-800 text-xs inline-block mr-3 select-none">Auto</div>
        <div onClick={() => { copy(`${item.cloudinary.thumb}`, displayName, 'link'); }} className=" cursor-pointer text-blue-500 mt-2 hover:text-blue-800 text-xs inline-block mr-3 select-none">Thumb</div>
        <div onClick={() => { copy(`${item.cloudinary.rawURL}`, displayName, 'link'); }} className=" cursor-pointer text-blue-500 mt-2 hover:text-blue-800 text-xs inline-block mr-3 select-none">Original</div>
      </div>

      <div className={'flex flex-row'}>
        <div className=" text-gray-500 mt-2 text-xs inline-block mr-3">Copy Image: </div>
        <div onClick={() => { copy(`${item.cloudinary.auto}`, displayName, 'tag'); }} className=" cursor-pointer text-blue-500 mt-2 hover:text-blue-800 text-xs inline-block mr-3 select-none">Auto</div>
        <div onClick={() => { copy(`${item.cloudinary.thumb}`, displayName, 'tag'); }} className=" cursor-pointer text-blue-500 mt-2 hover:text-blue-800 text-xs inline-block mr-3 select-none">Thumb</div>
        <div onClick={() => { copy(`${item.cloudinary.rawURL}`, displayName, 'tag'); }} className=" cursor-pointer text-blue-500 mt-2 hover:text-blue-800 text-xs inline-block mr-3 select-none">Original</div>
      </div>

    </div>
  </div>
}

export const GetMediaItems = ({ mediaItems, router, onPickImage }) => {
  return mediaItems.map(e => <MediaItem key={e._id} isPicker={!!onPickImage} onPickImage={() => { onPickImage ? onPickImage({ media: e }) : router.push(`/cms/folder/${e._id}`) }} item={e}></MediaItem>)
}

export const MediaLibGUI = ({ onPickImage = false }) => {
  const router = useRouter()
  const mediaItems = useMedia(s => s.mediaItems)
  const onArrive = useMedia(s => s.onArrive)
  useMemo(() => {
    if (router.query.id) {
      onArrive({ folderID: router.query.id })
    }
  }, [router.query.id])

  let mediaCount = mediaItems.length || 0

  return (<div className={''}>
    {!onPickImage && <Link href="/cms/folder"><h3 className="text-gray-700 text-sm font-medium underline cursor-pointer">Go Back to Folders Page</h3></Link>}
    {/* <span className="mt-3 text-sm algin-middle text-gray-500 mr-3">{mediaCount}<span className={'text-xs algin-middle'}>+</span> Media Items</span> */}
    {(mediaCount > 0) && <span className="block mt-1 text-sm algin-middle text-green-800">Press "ALT" Key to delete without confirm</span>}
    <div className={'grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mt-6'}>
      <UploadMediaItem></UploadMediaItem>
      {/* <MediaItem></MediaItem> */}
      {GetMediaItems({ mediaItems, router, onPickImage })}
    </div>
  </div>)
}
