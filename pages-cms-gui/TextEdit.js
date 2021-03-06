// import react, react-markdown-editor-lite, and a markdown parser you like
import { useState, useEffect, useRef } from 'react'
// import * as ReactDOM from 'react-dom'
import MarkdownIt from 'markdown-it'
// import style manually
import css from './mardown.module.css'

// import dynamic from 'next/dynamic';
import 'react-markdown-editor-lite/lib/index.css';
import { Modal } from './Modal';
import _debounce from 'lodash/debounce'
import { FolderLibGUI, MediaLibGUI } from './MediaLibGUI'
const mdParser = new MarkdownIt(/* Markdown-it options */);

export const TextDisplay = ({ text }) => {
  return <div className={`${css.markdown_my_version} ${css.highlight}`}>
      <div dangerouslySetInnerHTML={{ __html: mdParser.render(text) }}></div>
    </div>
}

export const MediaLibraryPage = ({ onPick }) => {
  const [view, setView] = useState('folder')
  const [folderID, setFolderID] = useState('')
  const onPickFolder = ({ folderID }) => {
    setView('detail')
    setFolderID(folderID)
  }
  const onPickImage = ({ media }) => {
    onPick({ descText: media.text, imageURL: media.cloudinary.auto })
  }
  return <div className=" overflow-scroll" style={{ height: 'calc(100vh - 300px)' }}>
    {view === 'folder' && <FolderLibGUI onPick={onPickFolder}></FolderLibGUI>}
    {view === 'detail' && folderID && <div className="underline" onClick={() => { setView('folder') }}>Back to Folders Picker Page</div>}
    {view === 'detail' && folderID && <MediaLibGUI onPickImage={onPickImage}></MediaLibGUI>}
    {/* <button className={`p-3 border rounded-xl border-gray-600`} onClick={() => onPick({ descText: 'this is the description text of the image', imageURL: 'https://via.placeholder.com/350x150' })}>Item Placeholder Button</button> */}
  </div>
}

export const TextEdit = ({ value, onUpdate = () => {} }) => {
  const Editor = require('react-markdown-editor-lite').default
  const [input, setInput] = useState('')
  const toggleRef = useRef()
  const editorRef = useRef()
  const timerRef = useRef()
  function handleEditorChange ({ html, text }) {
    onUpdate({ html, text })
    setInput(text)
  }

  let install = ({ toggle }) => {
    toggleRef.current = toggle
  }

  useEffect(() => {
    setInput(value)
    return () => {
    }
  }, [])

  let onPick = ({ descText, imageURL }) => {
    toggleRef.current(false)
    editorRef.current.insertText(`![${descText}](${imageURL})`)
  }

  return (
    <div className={`relative ${css.markdown_my_version} ${css.highlight}`}>
      <Modal onReady={install} onCancel={() => {}} title="Media Library" showButton={false}>
        <div style={{ width: `80vw` }}>
          <MediaLibraryPage onPick={onPick}></MediaLibraryPage>
        </div>
      </Modal>

      <button onClick={() => { toggleRef.current(true) }} className={'py-2 px-3 text-xs my-1 rounded-lg border border-gray-600'}>Pick image</button>

      <Editor
        ref={editorRef}
        style={{ height: '680px' }}
        value={input}

        renderHTML={(text) => {
          return new Promise((resolve) => {
            clearTimeout(timerRef.current)
            timerRef.current = setTimeout(() => {
              let html = mdParser.render(text)
              resolve(html)
            }, 1000)
          })
        }}

        onChange={handleEditorChange}
      />
    </div>

  )
}
