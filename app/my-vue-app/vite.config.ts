import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import {join} from "path";
import content from "@originjs/vite-plugin-content";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import {ElementPlusResolver} from "unplugin-vue-components/resolvers";
import glsl from 'rollup-plugin-glsl';
// https://vitejs.dev/config/

export default defineConfig({
    resolve: {
        alias: {
            '@': join(__dirname, "src"),
        }
    },
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
        content(),
        glsl({
            // By default, everything gets included
            include: '**/*.glsl',
            // Undefined by default
            exclude: ['**/index.html'],
            // Source maps are on by default
            // sourceMap: false,
        })


    ],
    server: {
        proxy: {
            "/emp": {
                target: "http://localhost:8080",
                ws: true,
                changeOrigin: true,
            },
        }
    }
});
