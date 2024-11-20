'use client'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'

const TLDR = ({ richTextDocument }) => {
  const options = {
    renderNode: {
      [BLOCKS.HEADING_1]: (node, children) => (
        <h1 className="text-3xl font-bold text-gray-800">{children}</h1>
      ),
      [BLOCKS.PARAGRAPH]: (node, children) => (
        <p className="text-lg leading-7 text-gray-700">{children}</p>
      ),
      [INLINES.HYPERLINK]: (node, children) => (
        <a
          href={node.data.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {children}
        </a>
      ),
    },
  }

  return (
    <div className="rounded-2xl border-2 bg-gradient-to-r from-purple-400 via-pink-500 to-pink-300 p-2 shadow-lg">
      <div className="h-full w-full rounded-xl bg-white p-4">
        <h1 className="mb-3 text-3xl font-bold">TL;DR</h1>
        {documentToReactComponents(richTextDocument, options)}
      </div>
    </div>
  )
}

export default TLDR
