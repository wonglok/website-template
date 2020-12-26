// import EditorJS from '@editorjs/editorjs'
// import { getTools } from './tools'
import { useRef, useEffect, useState } from 'react'
import React from "react";
import { Editor, Frame, Element, useEditor, useNode } from "@craftjs/core"
import { Pages, usePage } from '../your-cms/api';
import { useRouter } from 'next/router'
import * as RE from '../your-builder/user'

export const ToolTemplate = ({ children = <Element is={RE.Text} canvas></Element>, title = 'Template' }) => {
  // const { connectors, query } = useEditor()
  const { connectors } = useEditor()
  return <div
    ref={(ref) => {
      connectors.create(ref, children)
    }}
    className={'p-2 m-3 border border-gray-800 inline-block'}>
    {title}
  </div>
}

const DeleteBtn = () => {
  const { query } = useEditor()
  const { isDeletable, selectedNodeId, actions } = useEditor((state, query) => ({
    selectedNodeId: state.events.selected,
    isDeletable: state.events.selected && query.node(state.events.selected).isDeletable()
  }));

  return selectedNodeId && (
    <div className={'px-3 py-2 m-3 border border-red-500 text-red-500 rounded-lg inline-block ' + ' ' + (isDeletable ? '' : 'opacity-50')} onClick={() => isDeletable && actions.delete(selectedNodeId)}>Delete</div>
  )
}

const SaveBtn = () => {
  const router = useRouter()
  const { query } = useEditor()
  const savePage = usePage(state => state.savePage)
  const onSave = () => {
    let str = query.serialize()
    savePage({ _id: router.query.id, data: str })
  }
  useEffect(() => {
    let Shortcut = require('@codexteam/shortcuts')
    new Shortcut({
      name : 'CMD+S',
      on: document.body,
      callback: (event) => {
        onSave()
      }
    })
  }, [])

  return <div className={'px-3 py-2 m-3 border border-blue-500 text-blue-500 rounded-lg inline-block'} onClick={onSave}>Save</div>
}

export const SettingsPanel = () => {
  const { selected } = useEditor((state, query) => {
    const currentNodeId = state.events.selected;
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings
      };
      // query.node(currentNodeId)
    }

    return {
      selected
    }
  });

  return <div>
    <div>
      <SaveBtn></SaveBtn>
      <DeleteBtn></DeleteBtn>
    </div>
    <div>
      {
        selected && selected.settings && React.createElement(selected.settings)
      }
    </div>
  </div>
}

export const EditorBody = ({ children, page }) => {
  const [pageName, setPageName] = useState(page.displayName)
  const router = useRouter()
  const savePageName = usePage(state => state.savePageName)
  const onSaveName = () => {
    savePageName({ _id: router.query.id, displayName: pageName })
  }

  return (
    <div>
      {/* Header */}
      <div className="mx-6 my-6 text-4xl font-semibold dark:text-gray-400">
        Page:
        <div className={'inline-block ml-3'}>
        {page && <input value={pageName} onInput={(e) => { setPageName(e.target.value) }} className={'border-b border-black'} />}
        </div>
        <svg onClick={() => { onSaveName() }} className={'inline-block mx-3 cursor-pointer'} width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M11.492 10.172l-2.5 3.064-.737-.677 3.737-4.559 3.753 4.585-.753.665-2.5-3.076v7.826h-1v-7.828zm7.008 9.828h-13c-2.481 0-4.5-2.018-4.5-4.5 0-2.178 1.555-4.038 3.698-4.424l.779-.14.043-.789c.185-3.448 3.031-6.147 6.48-6.147 3.449 0 6.295 2.699 6.478 6.147l.044.789.78.14c2.142.386 3.698 2.246 3.698 4.424 0 2.482-2.019 4.5-4.5 4.5m.978-9.908c-.212-3.951-3.472-7.092-7.478-7.092s-7.267 3.141-7.479 7.092c-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.522-5.408"/></svg>
      </div>
      <div onClick={() => { router.push('/cms/pages') }} className="mx-6 text-2xl font-normal inline-flex items-center cursor-pointer">
        <svg className="inline mr-3" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M2.117 12l7.527 6.235-.644.765-9-7.521 9-7.479.645.764-7.529 6.236h21.884v1h-21.883z"/></svg>
        Save and Exit
      </div>

      {/* Old */}
      <div className="mx-3 flex justify-between">
      <div style={{ width: `calc(280px)` }}>
          <div>

          </div>

          <div>
          <ToolTemplate title="HTML">
              <Element is={RE.HTML}>
              </Element>
            </ToolTemplate>
            <ToolTemplate title="JavaScript">
              <Element is={RE.JavaScript}>
              </Element>
            </ToolTemplate>
            <ToolTemplate title="FramedHTML">
              <Element is={RE.FramedHTML}>
              </Element>
            </ToolTemplate>
            <ToolTemplate title="Flex Box">
              <Element canvas is={RE.FlexBox}>
              </Element>
            </ToolTemplate>
            <ToolTemplate title="Text">
              <Element is={RE.Text} text="Text Box Here"></Element>
            </ToolTemplate>
          </div>
        </div>

        <div style={{ width: `calc(100% - 280px * 2)` }}>
          {children}
        </div>
        <div style={{ width: `calc(280px)` }}>
          <SettingsPanel></SettingsPanel>
        </div>
      </div>
    </div>
  )
}

export const PageEditor = () => {
  let router = useRouter()
  let page = usePage(state => state.page)
  let pageData = usePage(state => state.page.data)
  let loadPage = usePage(state => state.loadPage)

  useEffect(() => {
    loadPage({ _id: router.query.id })
  }, [router.query.id])

  return (
    <div>
      {page && <Editor resolver={{ ...RE }}>
        <EditorBody page={page}>
          <Frame data={pageData}>
            <Element is={RE.Page} canvas></Element>
          </Frame>
        </EditorBody>
      </Editor>}
    </div>
  )
}
