import type { PluginObj } from '@babel/core'
import * as t from '@babel/types'

// Type guards
const isArray = (val: unknown): val is any[] => Array.isArray(val)
const isObject = (val: unknown): val is object =>
  val !== null && typeof val === 'object'
const isPlainObject = (val: unknown): val is object =>
  Object.prototype.toString.call(val) === '[object Object]'
const isMap = (val: unknown): val is Map<any, any> => val instanceof Map
const isSet = (val: unknown): val is Set<any> => val instanceof Set
const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'
const isString = (val: unknown): val is string => typeof val === 'string'
const isFunction = (val: unknown): val is Function => typeof val === 'function'

const objectToString = Object.prototype.toString

function createToDisplayStringHelper() {
  return t.functionDeclaration(
    t.identifier('__toDisplayString'),
    [t.identifier('val')],
    t.blockStatement([
      t.returnStatement(
        t.conditionalExpression(
          t.binaryExpression('==', t.identifier('val'), t.nullLiteral()),
          t.stringLiteral(''),
          t.callExpression(
            t.memberExpression(t.identifier('JSON'), t.identifier('stringify')),
            [
              t.identifier('val'),
              t.identifier('__replacer'),
              t.numericLiteral(2),
            ]
          )
        )
      ),
    ])
  )
}

function createReplacerFunction() {
  return t.functionDeclaration(
    t.identifier('__replacer'),
    [t.identifier('key'), t.identifier('val')],
    t.blockStatement([
      // Handle Map
      t.ifStatement(
        t.logicalExpression(
          '&&',
          t.binaryExpression('!==', t.identifier('val'), t.nullLiteral()),
          t.binaryExpression(
            '===',
            t.memberExpression(
              t.identifier('val'),
              t.identifier('constructor'),
              false,
              true
            ),
            t.identifier('Map')
          )
        ),
        t.blockStatement([
          // Create a variable to store the size
          t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier('size'),
              t.memberExpression(t.identifier('val'), t.identifier('size'))
            ),
          ]),
          // Return an object with a Map key
          t.returnStatement(
            t.objectExpression([
              t.objectProperty(
                t.stringLiteral('Map'),
                t.objectExpression([
                  t.objectProperty(
                    t.stringLiteral('size'),
                    t.identifier('size')
                  ),
                  t.objectProperty(
                    t.stringLiteral('entries'),
                    t.callExpression(
                      t.memberExpression(
                        t.callExpression(
                          t.memberExpression(
                            t.identifier('Array'),
                            t.identifier('from')
                          ),
                          [
                            t.callExpression(
                              t.memberExpression(
                                t.identifier('val'),
                                t.identifier('entries')
                              ),
                              []
                            ),
                          ]
                        ),
                        t.identifier('reduce')
                      ),
                      [
                        t.arrowFunctionExpression(
                          [
                            t.identifier('entries'),
                            t.arrayPattern([
                              t.identifier('k'),
                              t.identifier('v'),
                            ]),
                          ],
                          t.blockStatement([
                            t.expressionStatement(
                              t.assignmentExpression(
                                '=',
                                t.memberExpression(
                                  t.identifier('entries'),
                                  t.binaryExpression(
                                    '+',
                                    t.identifier('k'),
                                    t.stringLiteral(' =>')
                                  ),
                                  true
                                ),
                                t.identifier('v')
                              )
                            ),
                            t.returnStatement(t.identifier('entries')),
                          ])
                        ),
                        t.objectExpression([]),
                      ]
                    )
                  ),
                ])
              ),
            ])
          ),
        ])
      ),
      // Handle Set
      t.ifStatement(
        t.logicalExpression(
          '&&',
          t.binaryExpression('!==', t.identifier('val'), t.nullLiteral()),
          t.binaryExpression(
            '===',
            t.memberExpression(
              t.identifier('val'),
              t.identifier('constructor'),
              false,
              true
            ),
            t.identifier('Set')
          )
        ),
        t.blockStatement([
          // Create a variable to store the size
          t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier('size'),
              t.memberExpression(t.identifier('val'), t.identifier('size'))
            ),
          ]),
          // Return an object with a Set key
          t.returnStatement(
            t.objectExpression([
              t.objectProperty(
                t.stringLiteral('Set'),
                t.objectExpression([
                  t.objectProperty(
                    t.stringLiteral('size'),
                    t.identifier('size')
                  ),
                  t.objectProperty(
                    t.stringLiteral('values'),
                    t.callExpression(
                      t.memberExpression(
                        t.identifier('Array'),
                        t.identifier('from')
                      ),
                      [
                        t.callExpression(
                          t.memberExpression(
                            t.identifier('val'),
                            t.identifier('values')
                          ),
                          []
                        ),
                      ]
                    )
                  ),
                ])
              ),
            ])
          ),
        ])
      ),
      // Handle Symbol
      t.ifStatement(
        t.binaryExpression(
          '===',
          t.unaryExpression('typeof', t.identifier('val')),
          t.stringLiteral('symbol')
        ),
        t.returnStatement(t.stringLiteral('Symbol'))
      ),
      // Handle non-plain objects
      t.ifStatement(
        t.logicalExpression(
          '&&',
          t.binaryExpression(
            '===',
            t.unaryExpression('typeof', t.identifier('val')),
            t.stringLiteral('object')
          ),
          t.logicalExpression(
            '&&',
            t.binaryExpression('!==', t.identifier('val'), t.nullLiteral()),
            t.unaryExpression(
              '!',
              t.callExpression(t.identifier('Array.isArray'), [
                t.identifier('val'),
              ])
            )
          )
        ),
        t.returnStatement(
          t.callExpression(t.identifier('String'), [t.identifier('val')])
        )
      ),
      // Default case
      t.returnStatement(t.identifier('val')),
    ])
  )
}

export default function (): PluginObj {
  return {
    name: 'transform-jsx-expression',
    visitor: {
      Program: {
        enter(path) {
          // Add helper functions at the start of the file
          path.unshiftContainer('body', createToDisplayStringHelper())
          path.unshiftContainer('body', createReplacerFunction())
        },
      },
      JSXExpressionContainer(path) {
        const expression = path.get('expression')

        if (t.isLiteral(expression.node)) {
          return // Leave literals unchanged
        }

        // Replace expression with toDisplayString call
        const expressionNode = expression.node as t.Expression
        path
          .get('expression')
          .replaceWith(
            t.callExpression(t.identifier('__toDisplayString'), [
              expressionNode,
            ])
          )
      },
    },
  }
}
