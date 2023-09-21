import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { visualizer } from 'rollup-plugin-visualizer'
import { Plugin as importToCDN, autoComplete } from 'vite-plugin-cdn-import'
// import { createVitePlugins } from './build/plugins';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    // build 视图分析依赖文件
    visualizer({
      emitFile: false,
      filename: 'stats.html',
      gzipSize: true,
      open: true
    }),
    // 依赖包 CDN 引入
    importToCDN({
      modules: [
        autoComplete('vue'),
        {
          name: 'vue-router',
          var: 'VueRouter',
          path: 'dist/vue-router.global.js'
        },
        {
          name: 'pinia',
          var: 'pinia',
          path: 'dist/pinia.iife.min.js'
        }
      ]
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/var.scss";`
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // 静态资源分类打包
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  }
})
