// import react, react-markdown-editor-lite, and a markdown parser you like
import { useState, useEffect } from 'react'
// import * as ReactDOM from 'react-dom'
import MarkdownIt from 'markdown-it'
// import style manually

import dynamic from 'next/dynamic';
import 'react-markdown-editor-lite/lib/index.css';

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false
});

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

export const TextDisplay = ({ text }) => {
  return <div dangerouslySetInnerHTML={{ __html: mdParser.render(text) }}></div>
}

// Finish!
// This function can convert File object to a datauri string
function onImageUpload (file) {
  return new Promise(resolve => {
    // const reader = new FileReader();
    // reader.onload = data => {
    //   resolve(data.target.result);
    // };
    // reader.readAsDataURL(file);

    resolve('my image url dot dom')
  });
}

export const TextEdit = ({ value, onUpdate }) => {
  const [input, setinput] = useState('')

  function handleEditorChange({ html, text }) {
    // console.log('handleEditorChange', html, text)
    onUpdate({ html, text })
    setinput(text)
  }

  useEffect(() => {
    setinput(value)
  }, [])

  return (
    <MdEditor
      style={{ height: "500px" }}
      value={input}
      renderHTML={(text) => mdParser.render(text)}
      onImageUpload={onImageUpload}
      onChange={handleEditorChange}
    />
  )
}