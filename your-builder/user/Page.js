import React from "react"
import { useNode, useEditor } from "@craftjs/core"

export const Page = ({ children }) => {
  // let { editable } = useEditor(state => {
  //   return ({
  //     editable: state.options.enabled
  //   })
  // })

  const { connectors: {connect, drag} } = useNode();
  return (
    <div style={{ minHeight: '130px' }} ref={ref => connect(drag(ref))}>
      {children}
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
      return ['FlexBox'].includes(name)
    },
    canMoveOut: () => {
      return true
    }
  }
}
