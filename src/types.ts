import type { ViteDevServer } from "vite";
import type { PageDirOptions, GeneratorTree } from "vite-plugin-files";

export interface RouteFile {
    path: string;
    file: string;
    loading?: string;
    exact?: boolean;
    routes?: RouteFile[];
}

export interface RouteDirOptions extends PageDirOptions {
    baseRoute: string;
}

export interface GeneratorTreeMap {
    [key: string]: GeneratorTree;
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
    exclude: RegExp[];
    /**
     * Enable or not HashRouter .
     * @default false
     */
    hash: boolean;
    /**
     * not found 404 filePath
     */
    notFound?: string;
    /**
     * component async import loading filePath
     */
    loading?: string;
}

export type UserOptions = Partial<Options>;

export interface ResolvedOptions extends Options {
    devServer?: ViteDevServer;
}
