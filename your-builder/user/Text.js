import React, { useCallback } from "react";
import { useNode } from "@craftjs/core"
import ContentEditable from 'react-contenteditable'
import sanitizeHtml from 'sanitize-html'
export const Text = ({ text, className, textAlign, fontSize }) => {
  const { connectors: { connect, drag }, actions: { setProp }  } = useNode()

  return (
    <div className={`block m-4 p-4 whitespace-pre-wrap bg-opacity-5 hover:bg-opacity-20 border border-gray-300 transition-colors duration-200 ${className}`} ref={ref => connect(drag(ref))}>
      <ContentEditable
        html={text}
        onChange={e =>
          setProp(props =>
            props.text = sanitizeHtml(e.target.value)
          )
        }
        tagName="p"
        style={{ fontSize: `${fontSize}px`, textAlign, height: '100%' }}
      />
    </div>
  )
}

export const TextSettings = () => {
  return <div>
    123 123 123
  </div>
}

Text.craft = {
  name: 'Text',
  related: TextSettings,
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
