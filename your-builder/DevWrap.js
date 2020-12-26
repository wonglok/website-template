import React, { useEffect, useState, useRef } from "react"
import { useNode, useEditor } from "@craftjs/core"
// import { useRouter } from 'next/router'
// import { usePage } from "../your-cms/api"
import cx from 'classnames'

export const DevWrap = ({ children, className, devMargin = true }) => {
  let { hasSelection, editable } = useEditor(state => {
    return ({
      hasSelection: state.events.selected,
      editable: state.options.enabled
    })
  })

  let { name, selected, hovered } = useNode((state) => {
    return {
      name: state.data.name,
      selected: state.events.selected,
      hovered: state.events.hovered
    }
  })

  const { connectors: { connect, drag }  } = useNode()
  const devClass = editable ? 'p-4 border border-black' : ''

  return editable ? <div className={`${devClass} relative ${cx({ 'border-green-700 shadow-xl': selected, 'm-4': devMargin })} ${className} `} ref={ref => connect(drag(ref))}>
    <div className={'absolute items-center bg-green-700 text-white px-3 p-2'} style={{ zIndex: 9000, display: ((hasSelection && selected) || (!hasSelection && hovered)) ? 'inline-flex' : 'none', left: '-1px', height: '50px', top: 'calc(-50px - 1px)' }}>{name}</div>
    {children}
  </div> : <div className={className}>{children}</div>
}
