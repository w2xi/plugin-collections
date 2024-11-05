import { compileTemplate } from 'vue/compiler-sfc'
import fs from 'node:fs'
import type { Plugin } from 'vite'

interface Options {}

export default function vitePluginSvgLoader(options: Options = {}): Plugin {
  return {
    name: 'vite-plugin-svg-loader',
    // to override `vite:asset` plugin's behavior
    // by simply adjusting the order of the plugin before vite:asset
    // https://vite.dev/guide/api-plugin.html#plugin-ordering
    enforce: 'pre',
    load(id) {
      // *.svg?vue (vue component)
      // *.svg or *.svg?url (apply default behavior by vite:asset)
      // *.svg?raw (raw string)

      if (!/\.svg(\?(raw|vue|url))?$/.test(id)) {
        return
      }
      const [filename, query] = id.split('?', 2)
      // apply default behavior by vite:asset
      if (query === 'url') return

      let svg = ''
      try {
        svg = fs.readFileSync(filename, 'utf-8')
      } catch (e) {
        console.log(
          `${id} couldn't be loaded by vite-svg-loader, fallback to default loader`
        )
        return
      }
      if (query === 'raw') {
        return `export default ${JSON.stringify(svg)}`
      } else if (query === 'vue') {
        const { code } = compileTemplate({
          id,
          filename,
          source: svg,
          transformAssetUrls: false,
        })
        return `${code}\nexport default { render }`
      }
    },
  }
}
