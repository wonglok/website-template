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

export const MyStyle = () => {
  return  <style>{/* css */`
  .markdown_my_version {
    line-height: 1.5;
    --tw-text-opacity: 1;
    color: rgba(17, 24, 39, var(--tw-text-opacity));
    overflow-wrap: break-word;
  }

  .markdown_my_version > * + * {
    margin-top: 0px;
    margin-bottom: 1rem;
  }

  .markdown_my_version li + li {
    margin-top: 0.25rem;
  }

  .markdown_my_version li > p + p {
    margin-top: 1.5rem;
  }

  .markdown_my_version strong {
    font-weight: 600;
  }

  .markdown_my_version a {
    font-weight: 600;
    --tw-text-opacity: 1;
    color: rgba(37, 99, 235, var(--tw-text-opacity));
  }

  .markdown_my_version strong a {
    font-weight: 700;
  }

  .markdown_my_version h1 {
    border-bottom-width: 1px;
    font-weight: 600;
    font-size: 2.25rem;
    line-height: 2.5rem;
    line-height: 1.25;
    margin-bottom: 1rem;
    margin-top: 1.5rem;
    padding-bottom: 0.5rem;
  }

  .markdown_my_version h2 {
    border-bottom-width: 1px;
    font-weight: 600;
    font-size: 1.5rem;
    line-height: 2rem;
    line-height: 1.25;
    margin-bottom: 1rem;
    margin-top: 1.5rem;
    padding-bottom: 0.5rem;
  }

  .markdown_my_version h3 {
    font-weight: 600;
    font-size: 1.125rem;
    line-height: 1.75rem;
    line-height: 1.375;
    margin-bottom: 1rem;
    margin-top: 1.5rem;
  }

  .markdown_my_version h4 {
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.5rem;
    line-height: 1;
    margin-bottom: 1rem;
    margin-top: 1.5rem;
  }

  .markdown_my_version h5 {
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.25rem;
    line-height: 1.25;
    margin-bottom: 1rem;
    margin-top: 1.5rem;
  }

  .markdown_my_version h6 {
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.25rem;
    line-height: 1.25;
    margin-bottom: 1rem;
    margin-top: 1.5rem;
    --tw-text-opacity: 1;
    color: rgba(75, 85, 99, var(--tw-text-opacity));
  }

  .markdown_my_version blockquote {
    --tw-border-opacity: 1;
    border-color: rgba(209, 213, 219, var(--tw-border-opacity));
    border-left-width: 4px;
    font-size: 1rem;
    line-height: 1.5rem;
    padding-right: 1rem;
    padding-left: 1rem;
    --tw-text-opacity: 1;
    color: rgba(75, 85, 99, var(--tw-text-opacity));
  }

  .markdown_my_version code {
    --tw-bg-opacity: 1;
    background-color: rgba(229, 231, 235, var(--tw-bg-opacity));
    border-radius: 0.25rem;
    display: inline;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-size: 0.875rem;
    line-height: 1.25rem;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    padding-top: 1.25rem;
    padding-bottom: 1.25rem;
  }

  .markdown_my_version pre {
    --tw-bg-opacity: 1;
    background-color: rgba(243, 244, 246, var(--tw-bg-opacity));
    border-radius: 0.25rem;
    padding: 1rem;
  }

  .markdown_my_version pre code {
    background-color: transparent;
    border-radius: 0px;
    display: block;
    overflow: visible;
    padding: 0px;
  }

  .markdown_my_version ul {
    font-size: 1rem;
    line-height: 1.5rem;
    list-style-type: disc;
    padding-left: 2rem;
  }

  .markdown_my_version ol {
    font-size: 1rem;
    line-height: 1.5rem;
    list-style-type: decimal;
    padding-left: 2rem;
  }

  .markdown_my_version kbd {
    border-radius: 0.25rem;
    border-width: 1px;
    display: inline-block;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    font-weight: 400;
    font-size: 0.75rem;
    line-height: 1rem;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
    padding-top: 1.25rem;
    padding-bottom: 1.25rem;
    --tw-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    vertical-align: middle;
  }

  .markdown_my_version table {
    --tw-border-opacity: 1;
    border-color: rgba(75, 85, 99, var(--tw-border-opacity));
    font-size: 1rem;
    line-height: 1.5rem;
  }

  .markdown_my_version th {
    border-width: 1px;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .markdown_my_version td {
    border-width: 1px;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  /* Override pygments style background color. */

  .markdown_my_version .highlight pre {
    --tw-bg-opacity: 1 !important;
    background-color: rgba(243, 244, 246, var(--tw-bg-opacity)) !important;
  }

    `.trim()}</style>
}

export const TextDisplay = ({ text }) => {
  return <div className={'markdown_my_version'} >
      <MyStyle></MyStyle>
      <div dangerouslySetInnerHTML={{ __html: mdParser.render(text) }}></div>
    </div>
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
    <>
      <MyStyle></MyStyle>
      <MdEditor
        style={{ height: "500px" }}
        value={input}
        renderHTML={(text) => `<div class="markdown_my_version">${mdParser.render(text)}</div>`}
        onImageUpload={onImageUpload}
        onChange={handleEditorChange}
      />
    </>

  )
}