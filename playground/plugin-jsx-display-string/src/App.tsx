import { useState } from 'react'
import './App.css'

// Helper function to safely convert any value to a string
function safeToString(value: any): string {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (value instanceof RegExp) return value.toString()
  if (value instanceof Date) return value.toISOString()
  if (value instanceof Error) return value.toString()
  if (value instanceof Set) return `Set(${Array.from(value).join(', ')})`
  if (value instanceof Map)
    return `Map(${Array.from(value.entries())
      .map(([k, v]) => `${k} => ${v}`)
      .join(', ')})`
  if (typeof value === 'symbol') return value.toString()
  return String(value)
}

// Convert any value to a safe ReactNode
function toReactNode(value: any): React.ReactNode {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (
    value instanceof RegExp ||
    value instanceof Date ||
    value instanceof Error ||
    value instanceof Set ||
    value instanceof Map ||
    typeof value === 'symbol'
  ) {
    return safeToString(value)
  }
  return value
}

function App() {
  const [count, setCount] = useState(0)

  // Test cases for different types
  const testCases = {
    // Basic types
    null: null,
    undefined: undefined,
    string: 'Hello World',
    number: 42,
    boolean: true,

    // Arrays
    array: [1, 2, 3, 4, 5],
    nestedArray: [1, [2, 3], { a: 4 }],

    // Objects
    object: { name: 'John', age: 30 },
    nestedObject: { user: { name: 'John', hobbies: ['coding', 'reading'] } },

    // Collections
    set: new Set([1, 2, 3, 'test']),
    map: new Map<string, any>([
      ['key1', 'value1'],
      ['key2', { nested: 'value' }],
    ]),

    // Symbols
    symbol: Symbol('test'),
    symbolKey: { [Symbol('key').toString()]: 'value' },

    // Custom objects
    date: new Date(),
    error: new Error('test error'),
    regexp: /test/g,
  }

  return (
    <div className="container">
      <h1>JSX Display String Plugin Test</h1>

      {Object.entries(testCases).map(([type, value]) => (
        <div key={type} className="test-case">
          <h2>{type} Test:</h2>
          <div className="value-display">
            <p>
              Plugin Output:{' '}
              <span className="plugin-output">{toReactNode(value)}</span>
            </p>
            <p>
              Default toString:{' '}
              <span className="default-output">{safeToString(value)}</span>
            </p>
          </div>
          <code>Type: {Object.prototype.toString.call(value)}</code>
        </div>
      ))}

      <div className="test-case">
        <h2>Counter Test:</h2>
        <p>Count is: {count}</p>
        <button onClick={() => setCount(count + 1)}>Increment</button>
      </div>
    </div>
  )
}

export default App
