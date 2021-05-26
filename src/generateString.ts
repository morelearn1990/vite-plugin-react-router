import { RouteFile } from "./types";

function stringifyRoute(route: RouteFile): string {
    const { path, file, exact, routes } = route;

    const routesString = routes ? `routes:[${routes.map((el) => stringifyRoute(el)).join(",\n")}]` : "";
    const exactString = `exact:${routes ? "false" : !!exact},`;
    return `
        {
            path: "${path}",
            component: loadable(() => import("${file}")),
            ${exactString}
            ${routesString}
        }
    `;
}
export const stringifyRoutes = (routes: RouteFile[]): { stringRoutes: string } => {
    return { stringRoutes: `[${routes.map((el) => stringifyRoute(el)).join(",\n")}]` };
};

export const assembleCode = (stringRoutes: string) => {
    console.log("stringRoutes", stringRoutes);

    return `
        import React, { PropsWithoutRef, ComponentType } from "react";
        import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
        import loadable from "@loadable/component";
        
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

        export const routes = ${stringRoutes}
        
        export default function RouterRoot() {
            return <Router>{renderRoute(routes)}</Router>;
        }
    `;
};
