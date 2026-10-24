import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from 'path'
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
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData:
            `@use "@/static/style/variables/font-text.scss" as *;
             @use "@/static/style/variables/color.scss" as *;
             @use "@/static/style/variables/shape.scss" as *;
             @use "@/static/style/mixin/global.scss" as *;
            `
        }
      }
	  },
  
}));
