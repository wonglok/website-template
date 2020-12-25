// tools.js
export const getTools = () => {
  const Embed = require('@editorjs/embed')
  const Table = require('@editorjs/table')
  const Paragraph = require('@editorjs/paragraph')
  const List = require('@editorjs/list')
  const Warning = require('@editorjs/warning')

  const Code = require('@editorjs/code')
  const LinkTool = require('@editorjs/link')
  const Image = require('@editorjs/image')
  const Raw = require('@editorjs/raw')
  const Header = require('@editorjs/header')
  const Quote = require('@editorjs/quote')
  const Marker = require('@editorjs/marker')
  const CheckList = require('@editorjs/checklist')
  const Delimiter = require('@editorjs/delimiter')
  const InlineCode = require('@editorjs/inline-code')
  const SimpleImage = require('@editorjs/simple-image')

  return {
    embed: Embed,
    table: Table,
    paragraph: Paragraph,
    list: List,
    warning: Warning,
    code: Code,
    linkTool: LinkTool,
    image: Image,
    raw: Raw,
    header: Header,
    quote: Quote,
    marker: Marker,
    checklist: CheckList,
    delimiter: Delimiter,
    inlineCode: InlineCode,
    simpleImage: SimpleImage
  }

}