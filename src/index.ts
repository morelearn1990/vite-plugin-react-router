import type { Plugin } from "vite";
import { transform } from "esbuild";
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
        // TODO 对非默认导出JSX的组件进行过滤
        onFilterFile: () => {
            return true;
        },
        onGeneratedClient: (trees) => {
            const routes = generateRoutes(trees, options);
            const { stringRoutes, stringImport } = stringifyRoutes(routes);
            const code = assembleCode(stringRoutes, stringImport, options.hash);
            return code;
        }
    });

    let command: string;

    return {
        name,
        enforce,
        resolveId,
        configResolved(config) {
            command = config.command;
            configResolved(config);
        },
        configureServer(server) {
            options.devServer = server;
            configureServer && configureServer(server);
        },
        load,
        async transform(_code: string, id: string) {
            if (id === "/generated-routes") {
                const esbuildResult =
                    command == "serve"
                        ? await options.devServer?.transformWithEsbuild(_code, "/generated-routes.tsx", {
                              loader: "tsx"
                          })
                        : await transform(_code, { loader: "tsx" });

                return esbuildResult?.code;
            }
        }
    };
}

export * from "./types";
export default VitePluginReactRouter;
