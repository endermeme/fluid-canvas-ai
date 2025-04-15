
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import unusedFiles from "vite-plugin-unused-files";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      // Giảm thiểu khởi động lại không cần thiết
      overlay: false,
      // Tăng thời gian chờ để tránh khởi động lại quá nhanh
      timeout: 5000
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    unusedFiles({
      root: path.resolve(__dirname, 'src'), // specify root directory
      ignore: [
        '**/node_modules/**', 
        '**/*.d.ts', 
        '**/index.tsx', 
        '**/index.ts',
        '**/types.ts',
        '**/constants/**'
      ]
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Tối ưu hóa việc xây dựng và tải lại
  optimizeDeps: {
    exclude: [],
    include: ["react", "react-dom", "react-router-dom"],
  },
  // Tắt việc đổi tên hằng số để giảm thiểu khởi động lại
  esbuild: {
    keepNames: true,
  },
}));
