import { compileTemplate } from 'vue/compiler-sfc'
import fs from 'node:fs'
import { optimize } from 'svgo'
import type { Plugin } from 'vite'
import type { Config } from 'svgo'

interface Options {
  defaultImport?: 'raw' | 'url' | 'component'
  svgo?: boolean
  svgoConfig?: Config
}

export default function vitePluginSvgLoader(options: Options = {}): Plugin {
  const { defaultImport = 'url', svgo = true, svgoConfig } = options
  const svgRegex = /\.svg(\?(raw|component|url))?$/

  return {
    name: 'vite-plugin-svgv',
    // to override `vite:asset` plugin's behavior
    // by simply adjusting the order of the plugin before vite:asset
    // https://vite.dev/guide/api-plugin.html#plugin-ordering
    enforce: 'pre',
    load(id) {
      // *.svg?component (vue component)
      // *.svg or *.svg?url (apply default behavior by vite:asset)
      // *.svg?raw (raw string)

      if (!svgRegex.test(id)) {
        return
      }
      const [filename, query] = id.split('?', 2)
      const importType = query || defaultImport

      if (importType === 'url') return

      let svg = ''
      try {
        svg = fs.readFileSync(filename, 'utf-8')
      } catch (e) {
        console.log(
          `${id} couldn't be loaded by vite-plugin-svgv, fallback to default loader`
        )
        return
      }

      if (svgo) {
        svg = optimize(svg, {
          ...svgoConfig,
          path: filename,
        }).data
      }

      if (importType === 'raw') {
        return `export default ${JSON.stringify(svg)}`
      } else if (importType === 'component') {
        const { code } = compileTemplate({
          id,
          filename,
          source: svg,
        })
        return `${code}\nexport default { render }`
      }
    },
  }
}
