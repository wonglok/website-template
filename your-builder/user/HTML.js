import React, { useEffect, useState, useRef } from "react"
import { useNode } from "@craftjs/core"
import ContentEditable from 'react-contenteditable'
import sanitizeHtml from 'sanitize-html'

export const Ace = ({ value = '', onSave = () => {}, onChange = () => {} }) => {
  let ref = useRef()
  useEffect(() => {
    var ace = require('brace');
    require('brace/mode/javascript');
    require('brace/mode/glsl');
    require('brace/mode/html');
    require('brace/theme/monokai');
    require('brace/ext/searchbox');

    var editor = ace.edit(ref.current);
    editor.getSession().setMode('ace/mode/javascript');
    editor.setTheme('ace/theme/monokai');

      editor.setFontSize(17)
      editor.setOptions({
        // fontFamily: 'Inconsolata'
      })
      editor.$blockScrolling = Infinity

      window.addEventListener('resize', () => {
        editor.resize()
      })

      editor.on('change', () => {
        let newCode = editor.getValue()
        onChange({ code: newCode })
      })

      // on data down
      // this.Data.ts.modules.onLocal({
      //   handler: ({ results }) => {
      //     this.stopWatch = true
      //     // console.log(results.src)
      //     this.currentMod.src = results.src
      //     this.editor.setValue(this.currentMod.src, 1)
      //     // this.editor.moveCursorTo(0, 0)
      //     // this.editor.focus()
      //     // cm.focus()
      //     this.stopWatch = false
      //   },
      //   method: 'update'
      // })

      var session = editor.getSession()
      session.setUseWrapMode(false)
      session.setUseWorker(false)
      session.setMode('ace/mode/javascript')
      session.setOptions({ tabSize: 2, useSoftTabs: true })

      var commands = [
        {
          name: 'save',
          bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
          exec: () => {
            let newCode = editor.getValue()
            onSave({ code: newCode })
          },
          readOnly: true // false if this command should not apply in readOnly mode
        },
        {
          name: 'multicursor',
          bindKey: { win: 'Ctrl-D', mac: 'Command-D' },
          exec: function (editor) {
            editor.selectMore(1)
          },
          // multiSelectAction: 'forEach',
          scrollIntoView: 'cursor',
          readOnly: true // false if this command should not apply in readOnly mode
        }
      ]

      commands.forEach((command) => {
        editor.commands.addCommand(command)
      })

      editor.setValue(value, 1)
    return () => {
      editor.destroy()
    }
  }, [])

  return <div style={{ width: '100%', height: '500px' }} ref={ref}></div>
}

export const HTML = ({ isProductionMode = false, html, className }) => {
  const divRef = useRef()
  const { connectors: { connect, drag }, actions: { setProp }  } = useNode()
  const { selected, dragged } = useNode((state) => ({
    selected: state.events.selected,
    dragged: state.events.dragged
  }));

  const [editable, setEditable] = useState(false);

  useEffect(() => {
    divRef.current.innerHTML = html
  }, [html, editable])

  useEffect(() => {
    if (!selected) {
      setEditable(false)
    }
    if (dragged) {
      setEditable(false)
    }
  }, [selected, dragged]);
  let devClass = !isProductionMode ? 'block m-4 p-4 whitespace-pre-wrap bg-opacity-5 hover:bg-opacity-20 border border-gray-300 transition-colors duration-200 ' : ''

  return (
    <div className={`${devClass} ${className}`} ref={ref => connect(drag(ref))}>
      <div ref={divRef}></div>
    </div>
  )
}

const HTMLSettings = () => {
  const { actions: { setProp }, html } = useNode((node) => ({
    html: node.data.props.html
  }));

  return (
    <>
      <Ace
      value={html}
      onSave={({ code }) => {
        setProp(props => {
          props.html = code
          console.log(code)
        })
      }}
      ></Ace>
    </>
  )
}

HTML.craft = {
  name: 'HTML',
  props: {
    html: '',
    textAlign: 'left',
    fontSize: 17,
    text: 'some text'
  },
  related: {
    settings: HTMLSettings
  },
  rules: {
    canDrag: (node) => {
      return true
    },
    canDrop: (node) => {
      return true
    },
    canMoveIn: () => {
      return false
    },
    canMoveOut: () => {
      return true
    }
  }
}
