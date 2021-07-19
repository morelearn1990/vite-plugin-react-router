import type { GeneratedTrees, GeneratorTree } from "vite-plugin-files";
import { RouteFile, GeneratorTreeMap, ResolvedOptions } from "./types";
import { selectProperty } from "./utils";

// 特殊文件文件名匹配正则表达式
const SPACIALFILEREGEXP = /^(_layout|index|_loading|404)$/;
// 能往下级目录传递的特殊文件正则表达式
const HANDDOWNSPACIALFILEREGEXP = /^(_loading|404)$/;

// 替换动态参数和可选参数
function makePath(parentPath: string, filename: string) {
    return `${parentPath}/${filename.replace(/^\$/, ":").replace(/\$$/, "?")}`.replace(/\/\//, "/");
}

function makeFileName(name: string) {
    return name.substring(0, name.lastIndexOf("."));
}

function makeFilePath(path: string) {
    if (path[0] !== "/") path = "/" + path;
    return path;
}

// 当传入加载组件时，给 RouteFile 赋值 loading 属性
function generateFile(tree: GeneratorTree, parentPath: string, loading?: GeneratorTree): RouteFile {
    const filename = makeFileName(tree.name);
    const currentPath = makePath(parentPath, filename);
    const route: RouteFile = { path: currentPath, file: makeFilePath(tree.relativePath) };
    if (loading) route.loading = makeFilePath(loading.relativePath);
    return route;
}

function generateRoutesRecurse(
    tree: GeneratorTree,
    parentPath: string,
    optionRoutes: GeneratorTreeMap,
    superSpecialFiles: GeneratorTreeMap = {},
    isRoot: boolean = true
): RouteFile[] {
    let generatedRoutes: RouteFile[] = [];
    if (!tree.children || tree.children.length <= 0) return generatedRoutes;

    const currentPath = makePath(parentPath, isRoot ? "/" : tree.name);

    const filesMap: GeneratorTreeMap = {};
    const specialFilesMap: GeneratorTreeMap = { ...superSpecialFiles, ...optionRoutes };
    const dirsMap: GeneratorTreeMap = {};

    tree.children.forEach((el) => {
        if (el.type === "file") {
            const filename = makeFileName(el.name);
            const isSpacialFile = SPACIALFILEREGEXP.test(filename);
            if (isSpacialFile) {
                specialFilesMap[filename] = el;
            } else {
                filesMap[el.name] = el;
            }
        }
        if (el.type === "directory") dirsMap[el.name] = el;
    });

    const dirRoutes = Object.keys(dirsMap)
        .map((key) =>
            generateRoutesRecurse(
                dirsMap[key],
                currentPath,
                optionRoutes,
                selectProperty(specialFilesMap, (key) => HANDDOWNSPACIALFILEREGEXP.test(key)),
                false
            )
        )
        .reduce((pre, next) => pre.concat(next), []);

    generatedRoutes = generatedRoutes.concat(dirRoutes);

    // 将加载组件放入生成的文件，同时在 loadable 时放在 fallback props上
    const fileRoutes = Object.keys(filesMap).map((key) =>
        generateFile(filesMap[key], currentPath, specialFilesMap["_loading"])
    );
    generatedRoutes = generatedRoutes.concat(fileRoutes);

    // 存在 index 文件时将index文件路径删除index
    if (specialFilesMap["index"]) {
        const indexRoute: RouteFile = generateFile(specialFilesMap["index"], currentPath, specialFilesMap["_loading"]);
        indexRoute.path = indexRoute.path.replace(/\/index$/, "/");
        indexRoute.exact = true;
        generatedRoutes.push(indexRoute);
    }

    // TODO 处理404的情况
    if (specialFilesMap["404"]) {
        const notFoundRoute: RouteFile = generateFile(specialFilesMap["404"], currentPath);
        notFoundRoute.path = `${currentPath}/*`.replace("//", "/");
        notFoundRoute.exact = false;
        generatedRoutes.push(notFoundRoute);
    }

    // 存在 _layout 文件时生成嵌套路由
    if (specialFilesMap["_layout"]) {
        const layoutRoute: RouteFile = {
            path: currentPath,
            file: makeFilePath(specialFilesMap["_layout"].relativePath),
            routes: generatedRoutes
        };

        if (specialFilesMap["_loading"]) layoutRoute.loading = makeFilePath(specialFilesMap["_loading"].relativePath);
        generatedRoutes = [layoutRoute];
    }

    return generatedRoutes;
}

export const generateRoutes = (trees: GeneratedTrees, options: ResolvedOptions): RouteFile[] => {
    const routes = trees
        .map(([tree, pageDir]) => {
            let { baseRoute } = pageDir;
            return generateRoutesRecurse(tree, baseRoute, generateOptionRoutes(options));
        })
        .reduce((pre, next) => pre.concat(next), []);
    return routes;
};

const generateOptionRoutes = (options: ResolvedOptions): GeneratorTreeMap => {
    const { notFound, loading } = options;
    const optionRoutes: GeneratorTreeMap = {};
    if (loading) {
        optionRoutes["_loading"] = { name: "_loading", type: "file", path: loading, relativePath: loading };
    }
    if (notFound) {
        optionRoutes["404"] = { name: "404", type: "file", path: notFound, relativePath: notFound };
    }
    return optionRoutes;
};
