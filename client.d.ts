declare module "virtual:generated-routes" {
    import { ComponentType } from "react";
    const RouteRoot: ComponentType;
    export interface RouteConfig {
        path: string;
        exact: boolean;
        component: ComponentType;
        routes?: RouteConfig[];
    }
    export type routes = RouteConfig[];
    export default RouteRoot;
}
