export const EXPORT_HELPER_ID = '\0plugin-px2rem:export-helper'

export const helperCode = `
const __px2rem__helper = (val) => {
  const px2rem = (px, base = 16) => px.replace(/(\\d+)px/g, (_, p1) => p1 / base + 'rem')
  let ret
  if (typeof val === 'string') {
    ret = px2rem(val);
  } else if (typeof val === 'number') {
    ret = val / 16 + 'rem';
  } else if (val && typeof val === 'object') {
    const o = {}
    for (const [key, v] of Object.entries(val)) {
      o[key] = px2rem(v);
    }
    ret = o
  }
  return ret
}
`
