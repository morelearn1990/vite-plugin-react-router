import type { GeneratedTrees, GeneratorTree, PageDirOptions } from "vite-plugin-files";
import { RouteFile } from "./types";

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

function generatedFile(tree: GeneratorTree, parentPath: string): RouteFile {
    const filename = makeFileName(tree.name);

    const currentPath = makePath(parentPath, filename);
    if (filename == "index") {
        console.log("currentPath", currentPath);
    }
    return { path: currentPath, file: makeFilePath(tree.relativePath) };
}
function generateRoutesRecurse(tree: GeneratorTree, parentPath: string, isRoot: boolean): RouteFile[] {
    console.log("generateRoutesRecurse", tree);

    let generatedRoutes: RouteFile[] = [];
    if (!tree.children || tree.children.length <= 0) return generatedRoutes;

    const currentPath = makePath(parentPath, isRoot ? "/" : tree.name);

    const filesMap: { [key: string]: GeneratorTree } = {};
    const specialFilesMap: { [key: string]: GeneratorTree } = {};
    const dirsMap: { [key: string]: GeneratorTree } = {};

    tree.children.forEach((el) => {
        if (el.type === "file") {
            const filename = makeFileName(el.name);
            const isSpacialFile = /^(_layout|index|_loading|404)$/.test(filename);
            if (isSpacialFile) {
                specialFilesMap[filename] = el;
            } else {
                filesMap[el.name] = el;
            }
        }
        if (el.type === "directory") dirsMap[el.name] = el;
    });

    // TODO 加载组件逻辑处理

    const dirRoutes = Object.keys(dirsMap)
        .map((key) => generateRoutesRecurse(dirsMap[key], currentPath, false))
        .reduce((pre, next) => pre.concat(next), []);

    generatedRoutes = generatedRoutes.concat(dirRoutes);

    const fileRoutes = Object.keys(filesMap).map((key) => generatedFile(filesMap[key], currentPath));
    generatedRoutes = generatedRoutes.concat(fileRoutes);

    // 存在 index 文件时将index文件路径删除index
    if (specialFilesMap["index"]) {
        const indexRoute: RouteFile = generatedFile(specialFilesMap["index"], currentPath);
        indexRoute.path = indexRoute.path.replace(/\/index$/, "/");
        indexRoute.exact = true;
        generatedRoutes.push(indexRoute);
    }

    // TODO 处理404的情况
    if (specialFilesMap["404"]) {
        const notFoundRoute: RouteFile = generatedFile(specialFilesMap["404"], currentPath);
        notFoundRoute.path = `${currentPath}*`;
        notFoundRoute.exact = false;
        generatedRoutes.push(notFoundRoute);
    }

    // 存在 _layout 文件时生成嵌套路由
    if (specialFilesMap["_layout"]) {
        generatedRoutes = [
            { path: currentPath, file: makeFilePath(specialFilesMap["_layout"].relativePath), routes: generatedRoutes }
        ];
    }

    return generatedRoutes;
}

export const generateRoutes = (trees: GeneratedTrees): RouteFile[] => {
    const routes = trees
        .map(([tree, pageDir]) => {
            let { baseRoute } = pageDir;
            return generateRoutesRecurse(tree, baseRoute, true);
        })
        .reduce((pre, next) => pre.concat(next), []);
    return routes;
};
