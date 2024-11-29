import type { PluginOption } from 'vite'
import { compileTemplate } from 'vue/compiler-sfc'
import MagicString from 'magic-string'

export default function px2rem(options = {}): PluginOption {
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
        const ms = new MagicString(code)
        walk(ms, ast)

        return {
          code: ms.toString(),
          map: null,
        }
      }
    },
  }
}

function walk(ms: any, node: any) {
  if (node.children) {
    node.children.forEach((child) => {
      if (child.type === 1) {
        // element node
        const props = child.props
        props.forEach((prop: any) => {
          if (prop.type === NodeTypes.DIRECTIVE) {
            const loc = prop.loc
            const startOffset = loc.start.offset
            const endOffset = loc.end.offset
            if (prop.arg.content === 'style') {
              const content = loc.source.replace(
                /(\d+)px/g,
                (_, p1) => parseFloat(p1) / 16 + 'rem'
              )
              ms.update(startOffset, endOffset, content)
            }
          }
        })
        walk(ms, child)
      }
    })
  }
}

enum NodeTypes {
  ROOT = 0,
  ELEMENT = 1,
  TEXT = 2,
  COMMENT = 3,
  SIMPLE_EXPRESSION = 4,
  INTERPOLATION = 5,
  ATTRIBUTE = 6,
  DIRECTIVE = 7,
  COMPOUND_EXPRESSION = 8,
  IF = 9,
  IF_BRANCH = 10,
  FOR = 11,
  TEXT_CALL = 12,
  VNODE_CALL = 13,
  JS_CALL_EXPRESSION = 14,
  JS_OBJECT_EXPRESSION = 15,
  JS_PROPERTY = 16,
  JS_ARRAY_EXPRESSION = 17,
  JS_FUNCTION_EXPRESSION = 18,
  JS_CONDITIONAL_EXPRESSION = 19,
  JS_CACHE_EXPRESSION = 20,
  JS_BLOCK_STATEMENT = 21,
  JS_TEMPLATE_LITERAL = 22,
  JS_IF_STATEMENT = 23,
  JS_ASSIGNMENT_EXPRESSION = 24,
  JS_SEQUENCE_EXPRESSION = 25,
  JS_RETURN_STATEMENT = 26,
}
