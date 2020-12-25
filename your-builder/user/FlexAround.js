// components/user/Text.js
import React from "react";
import { useNode } from "@craftjs/core";

let Compos = ({ children, className }) => {
  const { connectors: {connect, drag} } = useNode();
  return (
    <div className={`m-4 p-4 bg-opacity-5 hover:bg-opacity-20 border border-gray-500 transition-colors duration-200 shadow-xl rounded-2xl flex justify-around ${className}`} ref={ref => connect(drag(ref))}>
      {children}
    </div>
  )
}

Compos.craft = {
  name: 'FlexAround',
  rules: {
    canDrag: () => {
      return true
    },
    canDrop: () => {
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

export const FlexAround = Compos
