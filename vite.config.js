import { createVuePlugin } from "vite-plugin-vue2";
import { defineConfig, loadEnv } from "vite";
import path from "path";
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  console.log("当前运行模式:", mode);
  console.log("环境变量 VITE_APP_BASE_URL:", env.VITE_APP_BASE_URL);
  return {
    plugins: [
      createVuePlugin({
        jsx: true,
        compilerOptions: {
          preserveWhitespace: false,
        },
      }),
    ],
    base: "/middist/",
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        vue: "vue/dist/vue.esm.js",
        "element-ui": path.resolve(__dirname, "node_modules/element-ui"),
      },
      extensions: [".js", ".vue", ".json"],
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            "table-border-color": "#dfe6ec",
          },
        },
      },
    },
    server: {
      host: "0.0.0.0",
      proxy: {
        "/api": {
          target: env.VITE_APP_BASE_URL,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
