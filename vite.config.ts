import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "transform",
    jsxDev: false,
    jsxImportSource: "custom_package",
    jsxInject: `import { jsx } from 'custom_package/jsx-runtime'`,
    jsxFactory: "jsx.component",
  },
});