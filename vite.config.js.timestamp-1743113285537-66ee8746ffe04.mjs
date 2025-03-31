// vite.config.js
import glob from "file:///C:/xampp/htdocs/build/node_modules/glob/glob.js";
import laravel from "file:///C:/xampp/htdocs/build/node_modules/laravel-vite-plugin/dist/index.js";
import path from "path";
import { defineConfig } from "file:///C:/xampp/htdocs/build/node_modules/vite/dist/node/index.js";
import react from "file:///C:/xampp/htdocs/build/node_modules/@vitejs/plugin-react/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\xampp\\htdocs\\build";
var vite_config_default = defineConfig({
  server: {
    watch: {
      ignored: ["!**/node_modules/your-package-name/**"]
    }
  },
  plugins: [
    laravel({
      input: [
        ...glob.sync("resources/js/**/*.jsx"),
        "resources/css/app.css"
      ],
      refresh: true
    }),
    react()
  ],
  // resolve: name => {
  //     const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
  //     return pages[`./Pages/${name}.jsx`]
  // },
  resolve: {
    alias: {
      "@Adminto": path.resolve(__vite_injected_original_dirname, "resources/js/Components/Adminto"),
      "@Tailwind": path.resolve(__vite_injected_original_dirname, "resources/js/Components/Tailwind"),
      "@Utils": path.resolve(__vite_injected_original_dirname, "resources/js/Utils"),
      "@Rest": path.resolve(__vite_injected_original_dirname, "resources/js/Actions")
    }
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name == "app-C6GHMxSp.css")
            return "app.css";
          return assetInfo.name;
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFx4YW1wcFxcXFxodGRvY3NcXFxcYnVpbGRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXHhhbXBwXFxcXGh0ZG9jc1xcXFxidWlsZFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzoveGFtcHAvaHRkb2NzL2J1aWxkL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IGdsb2IgZnJvbSAnZ2xvYic7XG5pbXBvcnQgbGFyYXZlbCBmcm9tICdsYXJhdmVsLXZpdGUtcGx1Z2luJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICAgIHNlcnZlcjoge1xuICAgICAgICB3YXRjaDoge1xuICAgICAgICAgICAgaWdub3JlZDogWychKiovbm9kZV9tb2R1bGVzL3lvdXItcGFja2FnZS1uYW1lLyoqJ10sXG4gICAgICAgIH1cbiAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgICAgbGFyYXZlbCh7XG4gICAgICAgICAgICBpbnB1dDogW1xuICAgICAgICAgICAgICAgIC4uLmdsb2Iuc3luYygncmVzb3VyY2VzL2pzLyoqLyouanN4JyksXG4gICAgICAgICAgICAgICAgJ3Jlc291cmNlcy9jc3MvYXBwLmNzcycsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgcmVmcmVzaDogdHJ1ZSxcbiAgICAgICAgfSksXG4gICAgICAgIHJlYWN0KCksXG4gICAgXSxcbiAgICAvLyByZXNvbHZlOiBuYW1lID0+IHtcbiAgICAvLyAgICAgY29uc3QgcGFnZXMgPSBpbXBvcnQubWV0YS5nbG9iKCcuL1BhZ2VzLyoqLyouanN4JywgeyBlYWdlcjogdHJ1ZSB9KVxuICAgIC8vICAgICByZXR1cm4gcGFnZXNbYC4vUGFnZXMvJHtuYW1lfS5qc3hgXVxuICAgIC8vIH0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgICBhbGlhczoge1xuICAgICAgICAgICAgJ0BBZG1pbnRvJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3Jlc291cmNlcy9qcy9Db21wb25lbnRzL0FkbWludG8nKSxcbiAgICAgICAgICAgICdAVGFpbHdpbmQnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAncmVzb3VyY2VzL2pzL0NvbXBvbmVudHMvVGFpbHdpbmQnKSxcbiAgICAgICAgICAgICdAVXRpbHMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAncmVzb3VyY2VzL2pzL1V0aWxzJyksXG4gICAgICAgICAgICAnQFJlc3QnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAncmVzb3VyY2VzL2pzL0FjdGlvbnMnKSxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgICAgIG91dHB1dDoge1xuICAgICAgICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiAoYXNzZXRJbmZvKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChhc3NldEluZm8ubmFtZSA9PSAnYXBwLUM2R0hNeFNwLmNzcycpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJ2FwcC5jc3MnO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXNzZXRJbmZvLm5hbWU7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5UCxPQUFPLFVBQVU7QUFDMVEsT0FBTyxhQUFhO0FBQ3BCLE9BQU8sVUFBVTtBQUNqQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFKbEIsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsUUFBUTtBQUFBLElBQ0osT0FBTztBQUFBLE1BQ0gsU0FBUyxDQUFDLHVDQUF1QztBQUFBLElBQ3JEO0FBQUEsRUFDSjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ0wsUUFBUTtBQUFBLE1BQ0osT0FBTztBQUFBLFFBQ0gsR0FBRyxLQUFLLEtBQUssdUJBQXVCO0FBQUEsUUFDcEM7QUFBQSxNQUNKO0FBQUEsTUFDQSxTQUFTO0FBQUEsSUFDYixDQUFDO0FBQUEsSUFDRCxNQUFNO0FBQUEsRUFDVjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLQSxTQUFTO0FBQUEsSUFDTCxPQUFPO0FBQUEsTUFDSCxZQUFZLEtBQUssUUFBUSxrQ0FBVyxpQ0FBaUM7QUFBQSxNQUNyRSxhQUFhLEtBQUssUUFBUSxrQ0FBVyxrQ0FBa0M7QUFBQSxNQUN2RSxVQUFVLEtBQUssUUFBUSxrQ0FBVyxvQkFBb0I7QUFBQSxNQUN0RCxTQUFTLEtBQUssUUFBUSxrQ0FBVyxzQkFBc0I7QUFBQSxJQUMzRDtBQUFBLEVBQ0o7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNILGVBQWU7QUFBQSxNQUNYLFFBQVE7QUFBQSxRQUNKLGdCQUFnQixDQUFDLGNBQWM7QUFDM0IsY0FBSSxVQUFVLFFBQVE7QUFDbEIsbUJBQU87QUFDWCxpQkFBTyxVQUFVO0FBQUEsUUFDckI7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
