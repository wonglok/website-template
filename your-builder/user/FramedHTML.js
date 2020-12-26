import React, { useEffect, useState, useRef } from "react"
import { useNode, useEditor } from "@craftjs/core"
import { useRouter } from 'next/router'
import { usePage } from "../../your-cms/api"
// import ContentEditable from 'react-contenteditable'
// import sanitizeHtml from 'sanitize-html'

const Iframe = ({ content }) => {
  const iRef = useRef()

  useEffect(() => {
    if (iRef.current) {
      let frame = iRef.current
      let doc = frame.contentDocument
      doc.open()
      doc.write(content)
      doc.close()
      frame.style.width = '100%'
      frame.style.height = `100%`
    }
  }, [content])

  return (
    <iframe src="about:blank" scrolling="no" frameBorder="0"  ref={iRef} />
  );
};

export const Ace = ({ value = '', onSave = () => {}, onChange = () => {} }) => {
  let ref = useRef()
  useEffect(() => {
    var ace = require('brace');
    // require('brace/mode/javascript');
    // require('brace/mode/glsl');
    require('brace/mode/html');
    require('brace/theme/monokai');
    require('brace/ext/searchbox');

    var editor = ace.edit(ref.current);
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
      session.setMode('ace/mode/html')
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

export const FramedHTML = ({ isProductionMode = false, html, className }) => {
  const divRef = useRef()
  const { connectors: { connect, drag }, actions: { setProp }  } = useNode()
  const { selected, dragged } = useNode((state) => ({
    selected: state.events.selected,
    dragged: state.events.dragged
  }));

  const [editable, setEditable] = useState(false);

  // useEffect(() => {
  //   divRef.current.innerFramedHTML = html
  //   console.log(divRef.current)
  // }, [html, editable])

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
      {html && <Iframe content={html}></Iframe> }
    </div>
  )
}

const FramedHTMLSettings = () => {
  const { actions: { setProp }, html, className } = useNode((node) => ({
    html: node.data.props.html,
    className: node.data.props.className
  }));

  const router = useRouter()
  const { query } = useEditor()
  const savePage = usePage(state => state.savePage)
  const goSave = () => {
    let str = query.serialize()
    savePage({ _id: router.query.id, data: str })
  }

  return (
    <>
      <input value={className} onInput={e => setProp(props => {
        props.className = e.target.value
      })}></input>
      <Ace
      value={html}
      onSave={({ code }) => {
        setProp(props => {
          props.html = code
          console.log(code)
          goSave()
        })
      }}
      ></Ace>
    </>
  )
}

FramedHTML.craft = {
  name: 'FramedHTML',
  props: {
    className: 'h-64 w-64',
    html: require('raw-loader!../data/my-html.txt').default || '',
    textAlign: 'left',
    fontSize: 17,
    text: 'some text'
  },
  related: {
    settings: FramedHTMLSettings
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
