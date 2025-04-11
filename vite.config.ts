import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from 'path'
import postcsspxtoviewport from 'postcss-px-to-viewport'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/static/icon')],
      symbolId: 'icon-[dir]-[name]', // 支持目录层级
      inject: 'body-last',    // DOM插入位置
      customDomId: '__svg_icons' // 自定义容器ID
    })

  ],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 5173,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 5173,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  resolve: {
      // 配置路径别名
      alias: {
          '@': path.resolve(__dirname, './src'),
      },
  },
  envPrefix: ['VITE_', 'TAURI_ENV_*'],
  css:{
      postcss:{
        plugins:[
          postcsspxtoviewport({
            unitToConvert: 'px', // 要转化的单位
            viewportWidth: 750, // UI设计稿的宽度
            unitPrecision: 6, // 转换后的精度，即小数点位数
            propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
            viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
            fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
            selectorBlackList: ['ignore-'], // 指定不转换为视窗单位的类名，
            minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
            mediaQuery: false, // 是否在媒体查询的css代码中也进行转换，默认false
            replace: true, // 是否转换后直接更换属性值
            exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
            // exclude: [],
            include: [/form-info-card/,/mobile-page/, /shareMb/, /editMb/], //如果设置了include，那将只有匹配到的文件才会被转换
            landscape: false // 是否处理横屏情况
          })

        ]
      },
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData:
            `@use "@/static/style/variables/font-text.scss" as *;
             @use "@/static/style/variables/color.scss" as *;
            `
        }
      }
	  },
  
}));
