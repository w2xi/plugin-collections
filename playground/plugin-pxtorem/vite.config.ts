import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Inspect from 'vite-plugin-inspect'
import px2rem from '../../packages/plugin-pxtorem/src'
import PostCssPx2Rem from 'postcss-pxtorem'

export default defineConfig({
  plugins: [vue(), px2rem(), Inspect()],
  css: {
    postcss: {
      plugins: [
        PostCssPx2Rem({
          rootValue: 16, // 基准值，1rem = 16px
          propList: ['*'], // 转换的属性，* 表示全部
          unitPrecision: 5, // rem 单位的小数点后位数
          selectorBlackList: [], // 不进行转换的选择器
          replace: true, // 是否替换掉直接写 px 的值
          mediaQuery: false, // 是否允许在媒体查询中转换 px
          minPixelValue: 0, // 设置最小的转换数值，只有大于 0 的 px 才会被转换
        }),
      ],
    },
  },
})
