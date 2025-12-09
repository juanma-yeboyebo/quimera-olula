import ViteYaml from "@modyfi/vite-plugin-yaml";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";
const baseSrc = path.resolve(__dirname, "../../libs/styles");
const clientSrc = path.resolve(__dirname, "./styles");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ViteYaml()],
  css: {
    preprocessorOptions: {
      scss: { additionalData: 
        `@import "${baseSrc}/_mixin";
        @import "${clientSrc}/_clientMixin";` 
      },
    },
  },
});
