import type { ViteDevServer } from "vite";
import type { PageDirOptions } from "vite-plugin-files";

export interface RouteFile {
    path: string;
    file: string;
    // component: string;
    exact?: boolean;
    routes?: RouteFile[];
}

export interface RouteDirOptions extends PageDirOptions {
    baseRoute: string;
}

/**
 * Plugin options.
 */
interface Options {
    /**
     * Relative path to the directory to search for page components.
     * @default 'src/pages'
     */
    routesDir: RouteDirOptions[];
    /**
     * file extension
     * @default ["tsx"]
     */
    extensions: string[];
    /**
     * List of path globs to exclude when resolving files.
     * @default ["components"]
     */
    exclude?: RegExp[];
    /**
     * import components asynchronously?
     * @default false
     */
    async?: boolean;
}

export type UserOptions = Partial<Options>;

export interface ResolvedOptions extends Options {
    devServer?: ViteDevServer;
}
