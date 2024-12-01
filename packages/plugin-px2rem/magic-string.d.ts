declare module 'magic-string' {
  export default class MagicString {
    constructor(str: string)
    update(start: number, end: number, content: string): void
    toString(): string
  }
}
