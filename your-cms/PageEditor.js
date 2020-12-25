// import EditorJS from '@editorjs/editorjs'
// import { getTools } from './tools'
import { useRef, useEffect, useState } from 'react'
import React from "react";
import {Editor, Frame, Element, useEditor} from "@craftjs/core"
import * as RE from '../your-builder/user'

export const ToolTemplate = ({ children = <Element is={RE.Box} canvas></Element>, title = 'Template' }) => {
  // const { connectors, query } = useEditor()
  const { connectors } = useEditor()
  return <div
  ref={(ref) => {
    connectors.create(ref, children)
  }}
  className={'p-2 m-3 border border-gray-800 inline-block'}>{title}</div>
}

//

export const ToolBox = () => {
  return (
    <div className="">
      <ToolTemplate title="Text">
      <Element is={RE.Text} text="Text Box Here">
        </Element>
      </ToolTemplate>
      <ToolTemplate title="Section">
        <Element canvas is={RE.Box}>
        </Element>
      </ToolTemplate>
      <ToolTemplate title="Box Flex">
        <Element canvas is={RE.Box} className="flex">
          <Element is={RE.Text} text="Text Box Here">
          </Element>
          <Element is={RE.Text} text="Text Box Here">
          </Element>
        </Element>
      </ToolTemplate>
    </div>
  )
}

export const PageEditor = ({ onChange = () => {}, onSave = () => {}, onReady = () => {}, page }) => {
  return (
    <div>
      <Editor resolver={RE}>
        <ToolBox></ToolBox>
        <Frame>
          <Element is={RE.Page} className={'bg-white'} canvas>
          </Element>
        </Frame>
      </Editor>
    </div>
  )
}
