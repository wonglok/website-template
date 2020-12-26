// import EditorJS from '@editorjs/editorjs'
// import { getTools } from './tools'
import { useRef, useEffect, useState } from 'react'
import React from "react";
import { Editor, Frame, Element, useEditor, useNode } from "@craftjs/core"
import { Pages, usePage } from '../your-cms/api';
import { useRouter } from 'next/router';
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

  useEffect(() => {
    if (selectedNodeId) {
      // const node = query.node(selectedNodeId)
      // const instance = node.get()
      // instance.dom.classList.add('border-blue-500')
      // instance.dom.classList.add('rounded-2xl')

      return () => {
        // instance.dom.classList.remove('border-blue-500')
        // instance.dom.classList.remove('rounded-2xl')
      }
    }
  }, [selectedNodeId, isDeletable])

  return selectedNodeId && (
    <div className={'px-3 py-2 m-3 border border-red-500 text-red-500 rounded-lg inline-block ' + ' ' + (isDeletable ? '' : 'opacity-50')} onClick={() => isDeletable && actions.delete(selectedNodeId)}>Delete</div>
  )
}

const SaveBtn = () => {
  const { query } = useEditor()
  const router = useRouter()
  const savePage = usePage(state => state.savePage)
  const onSave = () => {
    let str = query.serialize()
    savePage({ _id: router.query.id, data: str })
  }

  return <div className={'px-3 py-2 m-3 border border-blue-500 text-blue-500 rounded-lg inline-block'} onClick={onSave}>Save</div>
}

export const SelectedItem = () => {
  return <div>
    <div>
      <DeleteBtn></DeleteBtn>
    </div>
  </div>
}

export const EditorBody = ({ children, page }) => {
  return (
    <div>
      {/* Header */}
      <div className="mx-6 my-6 text-4xl font-semibold dark:text-gray-400">
        Page: {page && page.displayName}
      </div>

      {/* Old */}
      <div className="mx-3 flex justify-between">
      <div style={{ width: `calc(280px)` }}>
          <div>
            <SaveBtn></SaveBtn>
          </div>

          <div>
            <ToolTemplate title="Flex Around">
              <Element canvas is={RE.FlexAround}>
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
          <SelectedItem></SelectedItem>
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
