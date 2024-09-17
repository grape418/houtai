import { defineConfig,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode}) => {
  // 获取各个环境下的对应的变量
  const env =  loadEnv(mode,process.cwd())
  return {
    plugins: [vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
    viteMockServe({
      enable: command === 'serve',
    }),
  ],
    
    resolve: {
      alias: {
        "@": path.resolve("./src")
      }
    },
    // scss全局变量的配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";'
        }
      }
    },
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]:{
          // 获取服务器地址的设置
          target: env.VITE_SERVE,
          // 是否代理跨域
          changeOrigin: true,
          // 路径重写
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    }
  }
  // 代理跨域

})
