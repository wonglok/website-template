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

let ButtonSettings = () => {
  return <div>123</div>
}

Compos.craft = {
  related: ButtonSettings,
  rules: {
    canDrag: (node) => {
      return true
    },
    canDrop: (node) => {
      return true
    },
    canMoveIn: (income) => {
      let item = income.data.type.craft
      return true
    },
    canMoveOut: () => {
      return true
    }
  }
}

export const Page = Compos
