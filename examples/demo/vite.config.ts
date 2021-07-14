import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import RouterPlugin from "vite-plugin-react-router";
import Restart from "vite-plugin-restart";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        RouterPlugin({
            routesDir: [{ baseRoute: "", dir: "src/pages" }],
            extensions: ["tsx", "jsx"],
            notFound: "/src/options/_notFound",
            loading: "/src/options/_loading"
        }),
        reactRefresh(),
        Restart({ restart: ["../../dist/*.js"] })
    ]
});
