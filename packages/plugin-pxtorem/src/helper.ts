export const helperCode = `
const __px2rem__helper = (val, options = {}) => {
  const px2rem = px => px.replace(/(\\d+)px/g, (_, p1) => p1 / options.remUnit + 'rem')
  if (val && typeof val === 'object') {
    const ret = {}
    for (const [key, v] of Object.entries(val)) {
      ret[key] = px2rem(v);
    }
    return ret
  }
}
`
