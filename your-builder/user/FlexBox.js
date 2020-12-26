import React from "react";
import { useEditor, useNode } from '@craftjs/core'
import { ContentBlocks } from '../Types'
import { ClassNameEditor } from './ContentEditor'
import { DevWrap } from "../DevWrap";
// import { useRouter } from 'next/router'
// import { usePage } from '../../your-cms/api'

export const FlexBox = ({ children, className }) => {
  return (
    <DevWrap>
      {children}
    </DevWrap>
    // <div className={`${editable && classesEditable} ${className}`} ref={ref => connect(drag(ref))}>
    // </div>
  )
}

const FlexBoxSettings = () => {
  return (
    <>
      <ClassNameEditor></ClassNameEditor>
    </>
  )
}

FlexBox.craft = {
  name: 'FlexBox',
  props: {
    className: 'flex'
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
