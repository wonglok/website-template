import React, { useEffect, useState, useRef } from "react"
import { useNode, useEditor } from "@craftjs/core"
import { useRouter } from 'next/router'
import { usePage } from "../../your-cms/api"
import { DevWrap } from "../DevWrap";
import { Ace, ClassNameEditor, ContentEditor } from "./ContentEditor";
// import ContentEditable from 'react-contenteditable'
// import sanitizeHtml from 'sanitize-content'

const Division = ({ content }) => {
  const iRef = useRef()

  useEffect(() => {
    if (iRef.current) {
      let frame = iRef.current

      var element = window.document.createElement('html');
      element.innerHTML = content;

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

export const HTML = ({ content, className }) => {
  return (
    <DevWrap>
      {content && <Division className={className} content={content}></Division> }
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
