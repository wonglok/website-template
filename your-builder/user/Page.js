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
    <DevWrap devMargin={false}>
      {/* {editable && <div className={'h-3'}></div>} */}
      {children}
      {/* {editable && <div className={'h-3'}></div>} */}
    </DevWrap>
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
      console.log(name)
      return LayoutBlocks.includes(name)
    },
    canMoveOut: () => {
      return true
    }
  }
}
