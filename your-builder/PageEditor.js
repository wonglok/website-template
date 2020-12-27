// import EditorJS from '@editorjs/editorjs'
// import { getTools } from './tools'
import { useRef, useEffect, useState } from 'react'
import React from "react";
import { Editor, Frame, Element, useEditor, useNode } from "@craftjs/core"
import { Pages, usePage } from '../your-cms/api';
import { useRouter } from 'next/router'
import * as RE from '../your-builder/user'
import Sticky from 'react-stickynode'
import cx from 'classnames'

export const ToolTemplate = ({ children = <Element is={RE.Text} canvas></Element>, title = 'Template' }) => {
  // const { connectors, query } = useEditor()
  const { connectors } = useEditor()
  return <div
    ref={(ref) => {
      connectors.create(ref, children)
    }}
    className={'p-2 m-1 bg-white border border-gray-800 inline-block'}>
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
    <div className={'p-2 m-1  border border-gray-800 inline-block ' + ' ' + (isDeletable ? '' : 'opacity-50')} onClick={() => isDeletable && actions.delete(selectedNodeId)}>Delete</div>
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
      on: window,
      callback: (event) => {
        onSave()
      }
    })
  }, [])

  return <div className={'p-2 m-1  border border-gray-800 inline-block'} onClick={onSave}>Save</div>
}


const HistoryBtn = () => {
  const { canUndo, canRedo, actions } = useEditor((state, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo()
  }));

  return <>
      {
        canUndo && <button className={'p-2 m-1  border border-gray-800 inline-block'} onClick={() => actions.history.undo()}>Undo</button>
      }
      {
        canRedo && <button className={'p-2 m-1  border border-gray-800 inline-block'} onClick={() => actions.history.redo()}>Redo</button>
      }
  </>
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
    }

    return {
      selected
    }
  });

  return <div>
    {selected && <div className={'text-gray-800 p-3 mx-1 text-center font-sans text-bold border border-gray-800'}>
      {
        selected && selected.name
      }
    </div>}
    <div className={"mx-1"}>
      {
        selected && selected.settings && React.createElement(selected.settings)
      }
    </div>
  </div>
}

export const PreviewSaveBtn = ({ show, togglePanel }) => {
  const router = useRouter()
  const { query } = useEditor()
  const savePage = usePage(state => state.savePage)
  const onSave = () => {
    let str = query.serialize()
    savePage({ _id: router.query.id, data: str })
  }

  return <div className={'p-2 m-1 border border-gray-800 inline-block'} onClick={() => {
    // if (!show) {
    //   onSave()
    //   togglePanel()
    // } else {
    //   togglePanel()
    // }

    onSave()
      // togglePanel()
  }}>
    Save & Preview
    {/* { !show && 'Save & Preview' }
    { show && 'Close Drawer' } */}
  </div>
}

export const PreviewBtn = ({ onToggle }) => {
  return <div className={'p-2 m-1 border border-gray-800 inline-block'} onClick={onToggle}>
    { 'View as Public' }
  </div>
}

export const ClosePreviewBtn = ({ onToggle }) => {
  return <div className={'p-2 m-1 border border-gray-800 inline-block'} onClick={onToggle}>
    { 'Close' }
  </div>
}

export const OpenBtn = ({ href }) => {
  return <a className={'p-2 m-1 border border-gray-800 inline-block'} href={href} target="_blank">
    { 'New Tab' }
  </a>
}

export const EditorBody = ({ children, page }) => {
  const [pageName, setPageName] = useState(page.displayName)
  const router = useRouter()
  const savePageName = usePage(state => state.savePageName)
  const pageURL = usePage(state => state.pageURL)
  const onSaveName = () => {
    savePageName({ _id: router.query.id, displayName: pageName, data: page.data })
  }
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div>
      {/* Header */}
      <div onClick={() => { router.push('/cms/pages') }} className="mx-6 mt-6 text-2xl font-normal inline-flex items-center cursor-pointer">
        <svg className="inline mr-3" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M2.117 12l7.527 6.235-.644.765-9-7.521 9-7.479.645.764-7.529 6.236h21.884v1h-21.883z"/></svg>
        Save and Exit
      </div>

      <div className="mx-6 my-6 text-4xl font-semibold dark:text-gray-400">
        Page:
        <div className={'inline-block ml-3'}>
        {page && <input value={pageName} onInput={(e) => { setPageName(e.target.value) }} className={'border-b border-black'} />}
        </div>
        <svg onClick={() => { onSaveName() }} className={'inline-block mx-3 cursor-pointer'} width="24" height="24" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd"><path d="M11.492 10.172l-2.5 3.064-.737-.677 3.737-4.559 3.753 4.585-.753.665-2.5-3.076v7.826h-1v-7.828zm7.008 9.828h-13c-2.481 0-4.5-2.018-4.5-4.5 0-2.178 1.555-4.038 3.698-4.424l.779-.14.043-.789c.185-3.448 3.031-6.147 6.48-6.147 3.449 0 6.295 2.699 6.478 6.147l.044.789.78.14c2.142.386 3.698 2.246 3.698 4.424 0 2.482-2.019 4.5-4.5 4.5m.978-9.908c-.212-3.951-3.472-7.092-7.478-7.092s-7.267 3.141-7.479 7.092c-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.522-5.408"/></svg>
      </div>

      <div className="flex">
        <div style={{ width: `calc(380px)` }}>
          <Sticky enabled={true} top={0} bottomBoundary={0} zIndex={5000}>
            <div>
                <PreviewSaveBtn show={showPreview} togglePanel={() => setShowPreview(!showPreview)}></PreviewSaveBtn>
                <OpenBtn href={pageURL}></OpenBtn>
                {/* <PreviewBtn onToggle={() => { setShowPreview(!showPreview) }}></PreviewBtn> */}
                {/* <SaveBtn></SaveBtn> */}
                <DeleteBtn></DeleteBtn>
                <HistoryBtn></HistoryBtn>
            </div>
            <SettingsPanel></SettingsPanel>
          </Sticky>
        </div>

        <div style={{ width: `calc((100% - 380px) - 10px)`, marginLeft: '5px', marginRight: '5px' }}>
          <style>{`
            .sticky-inner-wrapper{
              z-index: 500;
            }
          `}</style>
          <div style={{ width: `calc((100%))`, 'top': '0px' }}>

            <Sticky innerClass={'bg-white shadow-lg'} enabled={true} top={0} bottomBoundary={0} zIndex={5000}>

                <ToolTemplate title="Flex Box">
                  <Element canvas is={RE.FlexBox}>
                  </Element>
                </ToolTemplate>

                <ToolTemplate title="HTML">
                  <Element is={RE.HTML}>
                  </Element>
                </ToolTemplate>

                <ToolTemplate title="JavaScript">
                  <Element is={RE.JavaScript}>
                  </Element>
                </ToolTemplate>

                <ToolTemplate title="CSS">
                  <Element is={RE.CSS}>
                  </Element>
                </ToolTemplate>

                <ToolTemplate title="FramedHTML">
                  <Element is={RE.FramedHTML}>
                  </Element>
                </ToolTemplate>
            </Sticky>

            {/* main canvas */}
            {/* <div className={'h-12'}></div> */}

            <div className={'flex justify-between'}>
              <div className="w-1/3">{children}</div>
              <div className="w-2/3">{<iframe src={pageURL} style={{ }} height={window.innerHeight} className={'w-full border border-gray-600'}></iframe>}</div>
            </div>
          </div>
        </div>
        {/* <div className={`fixed top-0 right-0 bg-white h-screen transition-transform duration-500 ease-out ${cx({ ' translate-x-full transform-gpu': !showPreview })} `} style={{ width: `calc((100% - 380px))`, zIndex: 200000, border: 'black solid 1px' }}>
          <div><ClosePreviewBtn onToggle={() => { setShowPreview(!showPreview) }}></ClosePreviewBtn><OpenBtn href={pageURL}></OpenBtn></div>
        </div> */}
      </div>
    </div>
  )
}

export const Page = ({ data }) => {
  return (
    <div>
      {data && <Editor enabled={false} resolver={{ ...RE }}>
        <Frame data={data}>
          <Element is={RE.Page} canvas></Element>
        </Frame>
      </Editor>}
    </div>
  )
}

export const PageEditor = () => {
  let router = useRouter()
  let page = usePage(state => state.page)
  let pageData = usePage(state => state.page.data)
  let loadPage = usePage(state => state.loadPage)
  let syncPage = usePage(state => state.syncPage)

  let onNodesChange = async (query) => {
    syncPage({ data: query.serialize() })
  }

  useEffect(() => {
    loadPage({ _id: router.query.id })
  }, [router.query.id])

  return (
    <div>
      {page && <Editor resolver={{ ...RE }} >
        <EditorBody page={page} onNodesChange={onNodesChange}>
          <Frame data={pageData}>
            <Element is={RE.Page} canvas></Element>
          </Frame>
        </EditorBody>
      </Editor>}
    </div>
  )
}
