import React from "react";
import { useEditor, useNode } from "@craftjs/core";
import { ContentBlocks } from '../Types'
import { useRouter } from "next/router";
import { usePage } from "../../your-cms/api";

export const FlexBox = ({ children, className }) => {
  const { connectors: { connect, drag } } = useNode();
  return (
    <div className={`${className}`} ref={ref => connect(drag(ref))}>
      {children}
    </div>
  )
}
const FlexBoxSettings = () => {
  const { actions: { setProp }, html, className } = useNode((node) => ({
    html: node.data.props.html,
    className: node.data.props.className
  }));

  // const router = useRouter()
  // const { query } = useEditor()
  // const savePage = usePage(state => state.savePage)
  // const goSave = () => {
  //   let str = query.serialize()
  //   savePage({ _id: router.query.id, data: str })
  // }

  return (
    <>
      {/* Apple */}
      <textarea value={className} onInput={e => setProp(props => {
        props.className = e.target.value
      })}></textarea>
{/*
      <Ace
        value={html}
        onSave={({ code }) => {
          setProp(props => {
            props.html = code
            console.log(code)
            goSave()
          })
        }}
      ></Ace> */}
    </>
  )
}


FlexBox.craft = {
  name: 'FlexBox',
  props: {
    className: `m-4 p-4 bg-opacity-5 hover:bg-opacity-20 border border-gray-500 transition-colors duration-200 shadow-xl rounded-2xl flex `
  },
  related: {
    settings: FlexBoxSettings
  },
  rules: {
    canDrag: (node) => {
      return true
    },
    canDrop: (node) => {
      return true
    },
    canMoveIn: (income) => {
      let name = income.data.type.craft.name
      return ContentBlocks.includes(name)
    },
    canMoveOut: () => {
      return true
    }
  }
}
