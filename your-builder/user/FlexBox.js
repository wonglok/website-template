import React from "react";
import { useNode } from "@craftjs/core";

export const FlexBox = ({ children, className }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div className={`m-4 p-4 bg-opacity-5 hover:bg-opacity-20 border border-gray-500 transition-colors duration-200 shadow-xl rounded-2xl flex ${className}`} ref={ref => connect(drag(ref))}>
      {children}
    </div>
  )
}

FlexBox.craft = {
  name: 'FlexBox',

  rules: {
    canDrag: (node) => {
      return true
    },
    canDrop: (node) => {
      return true
    },
    canMoveIn: (income) => {
      let name = income.data.type.craft.name
      return ['Text'].includes(name)
    },
    canMoveOut: () => {
      return true
    }
  }
}