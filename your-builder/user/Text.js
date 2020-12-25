// components/user/Text.js
import React from "react";
import { useNode } from "@craftjs/core";
export const Text = ({text, fontSize}) => {
  const { connectors: { connect, drag } } = useNode();
  return (
      <div className="block p-3 m-3 border border-gray-300" ref={ref => connect(drag(ref))}>
        <p style={{fontSize}}>{text}</p>
      </div>
  )
}
Text.craft = {
  rules: {
    canDrag: (node) => {
      console.log(node.data.props.text)
      return true
    }
  }
}