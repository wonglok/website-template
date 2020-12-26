import React from "react"
import { useNode, useEditor } from "@craftjs/core"
import { LayoutBlocks } from "../Types"
import { DevWrap } from "../DevWrap"

export const Page = ({ children }) => {
  let { editable } = useEditor(state => {
    return ({
      editable: state.options.enabled
    })
  })

  const { connectors: { connect, drag } } = useNode();
  return (
    <div className={'border border-black'}>
      {children}
      {editable && <div className={'h-24'}></div>}
    </div>
  )
}

Page.craft = {
  name: 'Page',
  rules: {
    canDrag: (node) => {
      return true
    },
    canDrop: (node) => {
      return true
    },
    canMoveIn: (income) => {
      let name = income.data.type.craft.name
      return LayoutBlocks.includes(name)
    },
    canMoveOut: () => {
      return true
    }
  }
}
