import react from "@vitejs/plugin-react";
import { getThemeVariables } from "antd/dist/theme";
import { defineConfig, loadEnv, transformWithEsbuild } from "vite";
import commonjs from "vite-plugin-commonjs";
import mkcert from "vite-plugin-mkcert";
import monacoEditorPlugin from "vite-plugin-monaco-editor";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import svgr from "vite-plugin-svgr";
import viteTsconfigPaths from "vite-tsconfig-paths";
import { theme } from "./src/lib/design-system/theme";

const config = ({ mode }) =>
  defineConfig({
    define: {
      global: "window",
      "process.env": loadEnv(mode, process.cwd(), ""),
    },
    plugins: [
      mkcert({
        hosts: ["requestly.local"],
      }),
      nodePolyfills(),

      // For files which has JSX elements in .js files
      {
        name: "treat-js-files-as-jsx",
        async transform(code, id) {
          if (!id.match(/src\/.*\.js$/)) return null; // include ts or tsx for TypeScript support
          // checks for .js files containing jsx code
          return transformWithEsbuild(code, id, {
            loader: "jsx",
            jsx: "automatic",
          });
        },
      },
      react(),

      // For setting home for relative imports to `src/`
      viteTsconfigPaths(),
      monacoEditorPlugin({}),
      commonjs(),
      svgr(),
    ],
    resolve: {
      // { find: '@', replacement: path.resolve(__dirname, 'src') },
      // fix less import by: @import ~
      // https://github.com/vitejs/vite/issues/2185#issuecomment-784637827
      alias: [
        {
          find: /^~/,
          replacement: "",
        },
      ],
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          ".js": "jsx",
        },
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: "@root-entry-name: default;",
          modifyVars: { ...getThemeVariables({ dark: true }), ...theme },
        },
      },
    },
    build: {
      outDir: "build",
    },
    server: {
      // open: "https://requestly.local:5577",
      port: 5577,
      fs: {
        allow: [".."],
      },
    },
  });

export default config;
