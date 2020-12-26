import React, { useEffect, useState, useRef } from "react"
import { useNode, useEditor } from "@craftjs/core"
import { useRouter } from 'next/router'
import { usePage } from "../../your-cms/api"
import { DevWrap } from "../DevWrap";
import { Ace, ClassNameEditor, ContentEditor } from "./ContentEditor";
// import ContentEditable from 'react-contenteditable'
// import sanitizeHtml from 'sanitize-content'

const FramedHTMLCore = ({ className, content }) => {
  const iRef = useRef()

  useEffect(() => {
    if (iRef.current) {
      let frame = iRef.current
      let doc = frame.contentDocument
      doc.open()
      doc.write(content)
      doc.close()
      frame.style.width = '100%'
      frame.style.height = `100%`
    }
  }, [content])

  return (
    <iframe className={className} src="about:blank" scrolling="no" frameBorder="0"  ref={iRef} />
  );
};

export const FramedHTML = ({ isProductionMode = false, content, className }) => {
  // let { editable } = useEditor(state => {
  //   return ({
  //     editable: state.options.enabled
  //   })
  // })

  return (
    <DevWrap>
      {content && <FramedHTMLCore content={content}></FramedHTMLCore> }
    </DevWrap>
  )
}

const FramedHTMLSettings = () => {
  return (
    <>
      <ClassNameEditor></ClassNameEditor>
      <ContentEditor mode={'html'}></ContentEditor>
    </>
  )
}

FramedHTML.craft = {
  name: 'FramedHTML',
  props: {
    className: 'h-64 w-64',
    content: require('raw-loader!../data/my-html.txt').default || ''
  },
  related: {
    settings: FramedHTMLSettings
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
