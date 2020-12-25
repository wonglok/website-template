import React from "react"
import { useNode } from "@craftjs/core"

export const Page = ({ children, className }) => {
  const { connectors: {connect, drag} } = useNode();
  return (
    <div className={`block m-4 p-4 bg-opacity-5 hover:bg-opacity-20 border border-black transition-colors shadow-xl duration-200 ${className}`} ref={ref => connect(drag(ref))}>
      {children}
      <div className={'h-32'}></div>
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
      return ['Block', 'FlexAround'].includes(name)
    },
    canMoveOut: () => {
      return true
    }
  }
}
