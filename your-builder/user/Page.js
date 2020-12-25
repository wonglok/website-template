// components/user/Text.js
import React from "react";
import { useNode } from "@craftjs/core";

let Compos = ({ children, className }) => {
  const { connectors: {connect, drag} } = useNode();
  return (
    <div className={`block m-4 p-4 bg-opacity-5 hover:bg-opacity-20 border border-black transition-colors duration-200 ${className}`} ref={ref => connect(drag(ref))}>
      {children}
    </div>
  )
}

Compos.craft = {
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
      return ['Block'].includes(name)
    },
    canMoveOut: () => {
      return true
    }
  }
}

export const Page = Compos
