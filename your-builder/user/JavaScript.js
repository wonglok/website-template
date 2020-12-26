import React, { useEffect, useState, useRef } from "react"
import { useNode, useEditor } from "@craftjs/core"
import { useRouter } from 'next/router'
import { usePage } from "../../your-cms/api"
import { DevWrap } from "../DevWrap";
import { ContentEditor } from "./ContentEditor";
// import ContentEditable from 'react-contenteditable'
// import sanitizeHtml from 'sanitize-content'

const ExecutionBox = ({ content }) => {
  const iRef = useRef()

  useEffect(() => {
    if (iRef.current) {
      try {
        let whenReady = () => {
          return (document.readyState === "complete" || document.readyState === "loaded")
        }
        let timer = setInterval(() => {
          if (whenReady()) {
            clearInterval(timer)
            eval(content)
          }
        })
      } catch (e) {
        console.log(e)
      }
    }
    return () => {
    }
  }, [content])

  return (
    <div ref={iRef} />
  );
};

export const JavaScript = ({ isProductionMode = false, content, className }) => {
  let { editable } = useEditor(state => {
    return ({
      editable: state.options.enabled
    })
  })

  let autoHide = editable ? ' ' : ' hidden'

  return (
    <DevWrap className={className + autoHide}>
      {editable && `Custom JavaScript (Global)`}
      {!editable && content && <ExecutionBox content={content}></ExecutionBox> }
    </DevWrap>
  )
}

const JavaScriptSettings = () => {
  return (
    <>
      <ContentEditor mode={'js'}></ContentEditor>
    </>
  )
}

JavaScript.craft = {
  name: 'JavaScript',
  props: {
    className: '',
    content: `console.log('testing code')`,
  },
  related: {
    settings: JavaScriptSettings
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
