import React from "react";
import { useEditor, useNode } from '@craftjs/core'
import { ContentBlocks, LayoutBlocks } from '../Types'
import { ClassNameEditor } from './ContentEditor'
import { DevWrap } from "../DevWrap";
// import { useRouter } from 'next/router'
// import { usePage } from '../../pages-cms-gui/api'

export const FlexBox = ({ children, className }) => {
  let { editable } = useEditor(state => {
    return ({
      editable: state.options.enabled
    })
  })
  return (
    editable ? <DevWrap className={className}>
      {/* <div className={className}> */}
        {children}
      {/* </div> */}
    </DevWrap> :
    <div className={className}>
      {children}
    </div>
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
      return [...ContentBlocks, ...LayoutBlocks].includes(name)
    },
    canMoveOut: () => {
      return true
    }
  }
}
