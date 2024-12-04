# vite-plugin-pxtorem

A vite plugin that allows you to convert inline style `px` into `rem` in `vue template`, both support static and dynamic style.

> For dynamic styles, the runtime code of helper function `__pxtorem__helper` will be injected into the compiled code by 'vite-plugin-pxtorem' under th hood.This allows us to convert dynamic style with `px` units into `rem` units.

## Installation

```bash
pnpm add vite-plugin-pxtorem -D
```

## Configuration

`vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import pxtorem from 'vite-plugin-pxtorem'

export default defineConfig({
  plugins: [
    pxtorem({
      remUnit: 16,
    }),
  ],
})
```

## Options

```ts
export type Options = {
  remUnit?: number
}
```

## Example 1: static style

input:

```html
<template>
  <div style="width: 100px; height: 100px;"></div>
</template>
```

output:

```html
<template>
  <div style="width: 6.25rem; height: 6.25rem;"></div>
</template>
```

## Example 2: dynamic style

input:

```html
<template>
  <div :style="{ width: '100px', height: '100px' }"></div>
</template>
```

output:

```html
<template>
  <div style="width: 6.25rem; height: 6.25rem;"></div>
</template>
```

## Example 3: dynamic style with `<script setup>`

**Input**

```html
<script lang="ts" setup>
  import { computed } from 'vue'

  const styles = computed(() => {
    return {
      width: '100px',
      height: '100px',
    }
  })
</script>
<template>
  <div :style="styles"></div>
</template>
```

## Example 4: dynamic style with `setup` hook

```html
<script lang="ts">
  import { computed } from 'vue'

  export default {
    setup() {
      const styles = computed(() => {
        return {
          width: '100px',
          height: '100px',
        }
      })
      return { styles }
    },
  }
</script>
<template>
  <div :style="styles"></div>
</template>
```

## Playground

see [playground](../../playground/plugin-pxtorem)

## License

[MIT](./LICENSE)
