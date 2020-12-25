// import EditorJS from '@editorjs/editorjs'
// import { getTools } from './tools'
import { useRef, useEffect, useState } from 'react'
import React from "react";
import {Editor, Frame, Element, useEditor} from "@craftjs/core"
import * as RE from '../your-builder/user'
import { usePage } from './api';
import { useRouter } from 'next/router';

export const ToolTemplate = ({ children = <Element is={RE.Block} canvas></Element>, title = 'Template' }) => {
  // const { connectors, query } = useEditor()
  const { connectors } = useEditor()
  return <div
  ref={(ref) => {
    connectors.create(ref, children)
  }}
  className={'p-2 m-3 border border-gray-800 inline-block'}>{title}</div>
}

export const EditorHeader = ({ onSave }) => {

  let save = async () => {
    let str = query.serialize()
    console.log(str)
  }

  return <>
  </>
}

export const ToolBox = ({ page }) => {
  const { query } = useEditor()
  const router = useRouter()
  const savePage = usePage(state => state.savePage)
  const onSave = () => {
    let str = query.serialize()
    savePage({ _id: router.query.id, data: str })
  }
  return (
    <div>
      <div className="my-4 mt-6 text-4xl font-semibold dark:text-gray-400">
        Page: {page && page.displayName}
      </div>
      <div className={'px-3 py-2 m-3 border border-blue-500 rounded-lg inline-block'} onClick={onSave}>Save</div>
      <div className="">
        <ToolTemplate title="Block">
          <Element canvas is={RE.Block}></Element>
        </ToolTemplate>
        <ToolTemplate title="Flex Around">
          <Element canvas is={RE.FlexAround}>
            <Element is={RE.Text} text="Text Box Here"></Element>
            <Element is={RE.Text} text="Text Box Here"></Element>
          </Element>
        </ToolTemplate>
        <ToolTemplate title="Text">
          <Element is={RE.Text} text="Text Box Here"></Element>
        </ToolTemplate>
      </div>
    </div>

  )
}

export const PageEditor = () => {
  let router = useRouter()
  let page = usePage(state => state.page)
  let pageData = usePage(state => state.page && state.page.data)
  let loadPage = usePage(state => state.loadPage)

  useEffect(() => {
    loadPage({ _id: router.query.id })
  }, [router.query.id])

  return (
    <div>
      <Editor enabled={true} resolver={RE}>
        <EditorHeader></EditorHeader>
        <ToolBox page={page}></ToolBox>
        <Frame data={pageData}>
          <Element is={RE.Page} className={'bg-white'} canvas>
          </Element>
        </Frame>
      </Editor>
    </div>
  )
}
