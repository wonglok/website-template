import React, { useEffect, useState, useRef } from "react"
import { useNode, useEditor } from "@craftjs/core"
import { useRouter } from 'next/router'
import { usePage } from "../../your-cms/api"
import { DevWrap } from "../DevWrap";
import { Ace, ClassNameEditor, ContentEditor } from "./ContentEditor";
// import ContentEditable from 'react-contenteditable'
// import sanitizeHtml from 'sanitize-content'
// iframe.js


const Division = ({ className, content }) => {
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: content }}></div>
  );
};


export const HTML = ({ content, className }) => {
  let { editable } = useEditor(state => {
    return ({
      editable: state.options.enabled
    })
  })
  return (
    <DevWrap>
      {editable && 'HTML Block'}
      {!editable && content && <Division className={className} content={content}></Division> }
    </DevWrap>
  )
}

const HTMLSettings = () => {
  return (
    <>
      <ClassNameEditor></ClassNameEditor>
      <ContentEditor mode={'html'}></ContentEditor>
    </>
  )
}

HTML.craft = {
  name: 'HTML',
  props: {
    className: '',
    content: `Funfun <b>content</b> <i>Wahahah</i>`
  },
  related: {
    settings: HTMLSettings
  },
  rules: {
    canDrag: (node) => {
      return true
    },
    canDrop: (node) => {
      return true
    },
    canMoveIn: () => {
      return false
    },
    canMoveOut: () => {
      return true
    }
  }
}
