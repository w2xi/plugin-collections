import type { PluginOption } from 'vite'
import { parse, compileTemplate, compileScript } from 'vue/compiler-sfc'
import MagicString from 'magic-string'
import { helperCode, EXPORT_HELPER_ID } from './helper'
import {
  NodeTypes,
  TemplateChildNode,
  SimpleExpressionNode,
} from '@vue/compiler-core'

let ms: MagicString

type Options = {
  remUnit: number
}

export default function px2rem(options = {}): PluginOption {
  return {
    name: 'vite-plugin-px2rem',
    enforce: 'pre',
    resolveId(id) {
      if (id === EXPORT_HELPER_ID) {
        return id
      }
    },
    async load(id) {
      if (id === EXPORT_HELPER_ID) {
        console.log('id', id, helperCode)
        return helperCode
      }
    },
    transform(code, id) {
      if (id.endsWith('.vue')) {
        const { ast } = compileTemplate({
          id,
          source: code,
          filename: id,
        })

        const { descriptor } = parse(code)
        const script = descriptor.scriptSetup || descriptor.script
        const loc = script?.loc!
        let content = `${helperCode}` + script!.content

        ms = new MagicString(code)
        ms.update(loc.start.offset, loc.end.offset, content)

        walk(ast?.children)

        return {
          code: ms.toString(),
          map: {
            mappings: '',
          },
        }
      }
    },
  }
}

function walk(node?: TemplateChildNode[]) {
  if (!node) return
  node.forEach((child) => {
    if (child.type === 1) {
      // element node
      const props = child.props
      props.forEach((prop) => {
        if (prop.type === NodeTypes.DIRECTIVE) {
          if (!prop.exp) return
          const loc = prop.exp.loc
          const startOffset = loc.start.offset
          const endOffset = loc.end.offset

          if ([':style', 'v-bind:style'].includes(prop.rawName || '')) {
            // dynamic style
            ms.update(startOffset, endOffset, `__px2rem__helper(${loc.source})`)
          } else {
            // static style
            if ((prop.arg as SimpleExpressionNode)?.content === 'style') {
              const content = loc.source.replace(
                /(\d+)px/g,
                (_: string, p1: number) => p1 / 16 + 'rem'
              )
              ms.update(startOffset, endOffset, content)
            }
          }
        }
      })
      walk(child.children)
    }
  })
}
