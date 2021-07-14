import { RouteFile } from "./types";

// 生成 loading 的 import 字符串
// 将 loading 组件变成驼峰命名，以便 loadable 的 fallback 使用
let importCache: { [path: string]: string } = {};
const generateImport = (path: string): string => {
    if (importCache[path]) return importCache[path];

    const importVar = path
        .replace(/\.\w+$/, "")
        .replace(/[\W_]([a-z A-Z])/g, (str) => str.toUpperCase())
        .replace(/[\W_]/g, "");
    importCache[path] = importVar;

    return importVar;
};

function stringifyRoute(route: RouteFile): string {
    const { path, file, exact, routes } = route;

    const routesString = routes ? `routes:[${routes.map((el) => stringifyRoute(el)).join(",\n")}]` : "";
    const exactString = `exact:${routes ? "false" : !!exact},`;
    const loadingString = route.loading ? `, { fallback: <${generateImport(route.loading)} /> }` : "";

    if (/\/\*$/.test(path)) {
        return `
        {
            path: "${path}",
            component: ${generateImport(route.file)},
            ${exactString}
        }
    `;
    }

    return `
        {
            path: "${path}",
            component: loadable(() => import("${file}")${loadingString}),
            ${exactString}
            ${routesString}
        }
    `;
}

export const stringifyRoutes = (routes: RouteFile[]): { stringRoutes: string; stringImport: string } => {
    importCache = {};
    return {
        stringRoutes: `[${routes.map((el) => stringifyRoute(el)).join(",\n")}]`,
        stringImport: Object.keys(importCache).reduce((pre, next) => {
            return `${pre} \nimport ${importCache[next]} from "${next}"`;
        }, "")
    };
};

export const assembleCode = (stringRoutes: string, stringImport: string, hash: boolean): string => {
    const createHistoryString = hash ? "createHashHistory" : "createBrowserHistory";

    return `
        import React, { PropsWithoutRef, ComponentType } from "react";
        import { Router, Switch, Route, Link } from "react-router-dom";
        import { ${createHistoryString} } from "history";

        import loadable from "@loadable/component";

        ${stringImport}
        
        export interface RouteConfig {
            path: string;
            exact: boolean;
            component: ComponentType;
            routes?: RouteConfig[];
        }
        
        function RouteWithSubRoutes(route: PropsWithoutRef<RouteConfig>) {
            return (
                <Route
                    exact={route.exact}
                    path={route.path}
                    render={(props) => (
                        <route.component {...props}>{route.routes && renderRoute(route.routes)}</route.component>
                    )}
                />
            );
        }
        
        function renderRoute(routes: RouteConfig[]) {
            return (
                <Switch>
                    {routes.map((route, i) => (
                        <RouteWithSubRoutes key={i} {...route} />
                    ))}
                </Switch>
            );
        }

        export const history = ${createHistoryString}()

        export const routes = ${stringRoutes}
        
        export default function RouterRoot() {
            return <Router history={history}>{renderRoute(routes)}</Router>;
        }
    `;
};
