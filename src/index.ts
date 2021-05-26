import type { Plugin } from "vite";
import { transform } from "esbuild";
import filesPlugin from "vite-plugin-files";
import { ResolvedOptions, UserOptions } from "./types";
import { resolveOptions } from "./options";
import { generateRoutes } from "./generateRoutes";
import { stringifyRoutes, assembleCode } from "./generateString";

function ViteReactRouter(userOptions: UserOptions): Plugin {
    const options: ResolvedOptions = resolveOptions(userOptions);
    const { routesDir, extensions, exclude } = options;

    return filesPlugin(
        {
            name: "vite-plugin-react-router",
            virtualId: "generated-routes",
            filesDir: routesDir,
            extensions,
            exclude,
            // onFilterFile: (filePath: string) => {
            //     // console.log("filePath", filePath);
            //     // const content = fs.readFileSync(filePath);
            //     return true;
            // },
            onGeneratedClient: (trees) => {
                const routes = generateRoutes(trees);
                const { stringRoutes } = stringifyRoutes(routes);
                const code = assembleCode(stringRoutes);
                // console.log("code", code);
                return code;
            }
        },
        {
            async transform(_code: string, id: string) {
                if (id === "/generated-routes") {
                    return await transform(_code, { loader: "tsx" });
                }
            }
        }
    );
}

export * from "./types";
export default ViteReactRouter;
