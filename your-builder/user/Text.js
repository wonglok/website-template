import React from "react"
import { useNode } from "@craftjs/core"

export const Text = ({ text, className }) => {
  const { connectors: { connect, drag } } = useNode()

  return (
    <div className={`block m-4 p-4 bg-opacity-5 hover:bg-opacity-20 border border-gray-300 transition-colors duration-200 ${className}`} ref={ref => connect(drag(ref))}>
      {text}
    </div>
  )
}

Text.craft = {
  name: 'Text',
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
