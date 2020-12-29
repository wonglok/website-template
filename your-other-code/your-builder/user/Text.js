import React, { useEffect, useState } from "react";
import { useNode, useEditor } from "@craftjs/core"
// import ContentEditable from 'react-contenteditable'
import sanitizeHtml from 'sanitize-html'
import { ClassNameEditor } from "./ContentEditor";
export const Text = ({ text, className, textAlign, fontSize }) => {
  const { connectors: { connect, drag }, actions: { setProp }  } = useNode()

  // const { selected, dragged } = useNode((state) => ({
  //   selected: state.events.selected,
  //   dragged: state.events.dragged
  // }));

  let { editable } = useEditor(state => {
    return ({
      editable: state.options.enabled
    })
  })

  return (
    <DevWrap className={`${className}`}>
      {editable ? <textarea
        value={text}
        onChange={e => {
          setProp(props => {
            props.text = sanitizeHtml(e.target.value)
          })
        }}
        style={{ fontSize: `${fontSize}px`, textAlign, height: '100%', width: '100%' }}
      /> : <p style={{ fontSize: `${fontSize}px`, textAlign, height: '100%', width: '100%' }}>{text}</p>}
    </DevWrap>

    // <div ref={ref => connect(drag(ref))}>
    // </div>
  )
}

const TextSettings = () => {
  const { actions: { setProp }, fontSize } = useNode((node) => ({
    fontSize: node.data.props.fontSize
  }));

  return (
    <>
      <form>
        <ClassNameEditor></ClassNameEditor>
        <label>Font size</label>
        <input
          type={'range'}
          value={fontSize || 7}
          step={1}
          min={1}
          max={50}
          onChange={(e) => {
            setProp(props => props.fontSize = Number(e.target.value) || 1);
          }}
        />
        <input
          type={'text'}
          value={fontSize || 7}
          step={1}
          min={1}
          max={50}
          onChange={(e) => {
            setProp(props => props.fontSize = Number(e.target.value) || 1);
          }}
        />
      </form>
    </>
  )
}

Text.craft = {
  name: 'Text',
  props: {
    textAlign: 'left',
    fontSize: 17,
    text: 'some text'
  },
  related: {
    settings: TextSettings
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
