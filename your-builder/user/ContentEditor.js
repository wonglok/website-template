import { useNode, useEditor } from '@craftjs/core';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { usePage } from '../../your-cms/api';

export const Ace = ({ mode = 'html', value = '', onSave = () => {}, onChange = () => {} }) => {
  let ref = useRef()
  useEffect(() => {
    var ace = require('brace');
    require('brace/mode/css');
    require('brace/mode/javascript');
    require('brace/mode/html');
    require('brace/mode/glsl');
    // require('brace/mode/html');

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

      var session = editor.getSession()
      session.setUseWrapMode(false)
      session.setUseWorker(false)

      if (mode === 'js') {
        session.setMode('ace/mode/javascript')
      }
      if (mode === 'css') {
        session.setMode('ace/mode/css')
      }
      if (mode === 'html') {
        session.setMode('ace/mode/html')
      }

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

/*
<Ace
  mode={'html'}
  value={html}
  onUpdate={({ code }) => {

  }}
  onSave={({ code }) => {
    setProp(props => {
      props.html = code
      console.log(code)
      goSave()
    })
  }}
></Ace>
*/

export const ClassNameEditor = () => {
  const router = useRouter()
  const { actions: { setProp }, className } = useNode((node) => ({
    className: node.data.props.className
  }));
  const savePage = usePage(state => state.savePage)
  const { query } = useEditor()

  const goSave = () => {
    let str = query.serialize()
    savePage({ _id: router.query.id, data: str })
  }

  return <textarea onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && (e.keyCode === 84 || e.key === 's')) { e.preventDefault(); e.stopPropagation(); goSave() } }} className={'w-full h-full mb-0 bg-gray-800 text-white'} value={className} onInput={e => setProp(props => {
    props.className = e.target.value
  })}></textarea>
}

export const ContentEditor = ({ mode = 'js' }) => {
  const { actions: { setProp }, content } = useNode((node) => ({
    content: node.data.props.content,
  }));

  const router = useRouter()
  const { query } = useEditor()
  const savePage = usePage(state => state.savePage)
  const goSave = () => {
    let str = query.serialize()
    savePage({ _id: router.query.id, data: str })
  }
  // const goSync = ({ code }) => {
  //   // let str = query.serialize()
  //   // syncPage({ _id: router.query.id, data: str })
  // }

  return (
    <Ace
      mode={mode}
      value={content}

      onChange={({ code }) => {
        if (mode !== 'js') {
          setProp(props => {
            props.content = code
            // goSync({ code })
          })
        }
      }}

      onSave={({ code }) => {
        setProp(props => {
          props.content = code
          // console.log(code)
          goSave()
        })
      }}
    ></Ace>
  )
}
