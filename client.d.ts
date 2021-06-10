declare module "virtual:generated-routes" {
    import { History } from "history";
    import { ComponentType } from "react";

    export interface RouteConfig {
        path: string;
        exact: boolean;
        component: ComponentType;
        routes?: RouteConfig[];
    }

    export type routes = RouteConfig[];
    export const history: History;

    const RouteRoot: ComponentType;
    export default RouteRoot;
}
