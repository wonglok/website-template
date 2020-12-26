import React, { useEffect, useState, useRef } from "react"
import { useNode, useEditor } from "@craftjs/core"
import { useRouter } from 'next/router'
import { usePage } from "../../your-cms/api"
import { DevWrap } from "../DevWrap";
import { Ace, ClassNameEditor, ContentEditor } from "./ContentEditor";
// import ContentEditable from 'react-contenteditable'
// import sanitizeHtml from 'sanitize-content'

const CSSDiv = ({ content }) => {
  const iRef = useRef()

  useEffect(() => {
    if (iRef.current) {
      let frame = iRef.current

      var element = window.document.createElement('html');
      element.innerHTML = `<style>${content}</style>`;

      iRef.current.appendChild(element)

      frame.style.width = '100%'
      frame.style.height = `100%`
    }

    return () => {
      if (iRef.current) {
        iRef.current.innerHTML = ''
      }
    }
  }, [content])

  return (
    <div ref={iRef} />
  );
};

export const CSS = ({ content, className }) => {
  let { editable } = useEditor(state => {
    return ({
      editable: state.options.enabled
    })
  })
  return (
    <DevWrap>
      {editable && 'Custom CSS'}
      {!editable && content && <CSSDiv content={content}></CSSDiv> }
    </DevWrap>
  )
}

const CSSSettings = () => {
  return (
    <>
      <ContentEditor mode={'css'}></ContentEditor>
    </>
  )
}

CSS.craft = {
  name: 'CSS',
  props: {
    className: '',
    content: `body { color: red; }`
  },
  related: {
    settings: CSSSettings
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
