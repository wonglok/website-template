// import EditorJS from '@editorjs/editorjs'
// import { getTools } from './tools'
import { useRef, useEffect, useState } from 'react'
import React from "react";
import {Editor, Frame, Element, useEditor} from "@craftjs/core"
import * as RE from '../your-builder/user'
import { compress, decompress } from 'shrink-string'

export const ToolTemplate = ({ children = <Element is={RE.Box} canvas></Element>, title = 'Template' }) => {
  // const { connectors, query } = useEditor()
  const { connectors } = useEditor()
  return <div
  ref={(ref) => {
    connectors.create(ref, children)
  }}
  className={'p-2 m-3 border border-gray-800 inline-block'}>{title}</div>
}

export const SaveAndLoad = ({ onSave }) => {
  const { query } = useEditor()
  let save = async () => {
    const str = await compress(query.serialize());
    onSave(str)
  }

  return <>
    <div className={'px-3 py-2 m-3 border border-blue-500 rounded-lg inline-block'} onClick={save}>Save</div>
  </>
}

export const ToolBox = () => {
  return (
    <div>
      <div className="">
        <ToolTemplate title="Section">
          <Element canvas is={RE.Box}></Element>
        </ToolTemplate>
        <ToolTemplate title="Box Flex">
          <Element canvas is={RE.Box} className="flex flex-wrap">
            <Element is={RE.Text} text="Text Box Here"></Element>
            <Element is={RE.Text} text="Text Box Here"></Element>
          </Element>
        </ToolTemplate>
        <ToolTemplate title="Text">
          <Element is={RE.Text} text="Text Box Here"></Element>
        </ToolTemplate>
      </div>
      <div className="">

      </div>
    </div>

  )
}

export const PageEditor = ({ onLoadHook, onSave }) => {
  let [data, setData] = useState(null)

  onLoadHook(async (page) => {
    console.log(page)
    if (page && page.data) {
      let str = await decompress(page.data)
      setData(str)
    }
  })

  return (
    <div>
      <Editor enabled={true} resolver={RE}>
        <SaveAndLoad onSave={onSave}></SaveAndLoad>
        <ToolBox></ToolBox>
        <Frame data={data}>
          <Element is={RE.Page} className={'bg-white'} canvas>
          </Element>
        </Frame>
      </Editor>
    </div>
  )
}
