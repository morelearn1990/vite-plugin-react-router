import type { Plugin } from "vite";
import {} from "vite";
import filesPlugin from "vite-plugin-files";
import { ResolvedOptions, UserOptions } from "./types";
import { resolveOptions } from "./options";
import { generateRoutes } from "./generateRoutes";
import { stringifyRoutes, assembleCode } from "./generateString";

function VitePluginReactRouter(userOptions: UserOptions): Plugin {
    const options: ResolvedOptions = resolveOptions(userOptions);
    const { routesDir, extensions, exclude } = options;

    const { name, enforce, resolveId, configResolved, configureServer, load } = filesPlugin({
        name: "vite-plugin-react-router",
        virtualId: "generated-routes",
        filesDir: routesDir,
        extensions,
        exclude,
        // TODO 对非组件文件进行过滤
        onFilterFile: () => {
            return true;
        },
        onGeneratedClient: (trees) => {
            const routes = generateRoutes(trees);
            const { stringRoutes } = stringifyRoutes(routes);
            const code = assembleCode(stringRoutes, options.hash);
            // console.log("code", code);
            return code;
        }
    });

    return {
        name,
        enforce,
        resolveId,
        configResolved,
        configureServer(server) {
            options.devServer = server;
            configureServer && configureServer(server);
        },
        load,
        async transform(_code: string, id: string) {
            if (id === "/generated-routes") {
                return await options.devServer?.transformWithEsbuild(_code, "/generated-routes", { loader: "tsx" });
            }
        }
    };
}

export * from "./types";
export default VitePluginReactRouter;
