// components/user/Text.js
import React from "react";
import { useNode } from "@craftjs/core";

let Compos = ({ text, className }) => {
  const { connectors: {connect, drag} } = useNode();
  return (
    <div className={`block m-4 p-4 bg-opacity-5 hover:bg-opacity-20 border border-gray-300 transition-colors duration-200 ${className}`} ref={ref => connect(drag(ref))}>
      {text}
    </div>
  )
}

Compos.craft = {
  rules: {
    canDrag: (node) => {
      return true
    },
    canDrop: (node) => {
      return true
    },
    canMoveIn: () => {
      return true
    },
    canMoveOut: () => {
      return true
    }
  }
}

export const Text = Compos
