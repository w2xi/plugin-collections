import type { Plugin } from 'vite'
import { parse, compileTemplate } from 'vue/compiler-sfc'
import MagicString from 'magic-string'
import { helperName, helperCode } from './helper'
import {
  NodeTypes,
  TemplateChildNode,
  SimpleExpressionNode,
} from '@vue/compiler-core'

let ms: MagicString

export type Options = {
  remUnit?: number
}

export default function px2rem(
  options: Options = {
    remUnit: 16,
  }
): Plugin {
  return {
    name: 'vite-plugin-px2rem',
    enforce: 'pre',
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

        walk(ast?.children || [], options)

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

function walk(
  node: TemplateChildNode[],
  options: Options = {
    remUnit: 16,
  }
) {
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
            ms.update(
              startOffset,
              endOffset,
              `${helperName}(${loc.source}, { ${Object.entries(options)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ')} })`
            )
          } else {
            // static style
            if ((prop.arg as SimpleExpressionNode)?.content === 'style') {
              const content = loc.source.replace(
                /(\d+)px/g,
                (_: string, p1: number) => p1 / options.remUnit! + 'rem'
              )
              ms.update(startOffset, endOffset, content)
            }
          }
        }
      })
      walk(child.children, options)
    }
  })
}
