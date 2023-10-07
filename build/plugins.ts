import { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { visualizer } from 'rollup-plugin-visualizer';
import { Plugin as importToCDN, autoComplete } from 'vite-plugin-cdn-import';
import viteCompression from 'vite-plugin-compression';

/**
 * 创建 vite 插件
 * @param viteEnv
 */
export const createVitePlugins = (viteEnv: ViteEnv): (PluginOption | PluginOption[])[] => {
  return [
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
    }),
    // 打包压缩
    createCompression(viteEnv)
  ];
};

/**
 * 创建打包压缩插件
 * @param viteEnv
 */
const createCompression = (viteEnv: ViteEnv): PluginOption | PluginOption[] => {
  const { VITE_BUILD_COMPRESS = 'none' } = viteEnv;
  const compressList = VITE_BUILD_COMPRESS.split(',');
  const compressPlugin: PluginOption[] = [];
  if (compressList.includes('gzip')) {
    compressPlugin.push(
      viteCompression({
        verbose: true,
        algorithm: 'gzip',
        ext: '.gz'
      })
    );
  }
  if (compressList.includes('brotli')) {
    compressPlugin.push(
      viteCompression({
        verbose: true,
        algorithm: 'brotliCompress',
        ext: '.br'
      })
    );
  }
  return compressPlugin;
};
