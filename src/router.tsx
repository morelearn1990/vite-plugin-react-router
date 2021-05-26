import React, { ComponentType } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

export interface RouteConfig {
    path: string;
    component: ComponentType;
    routes?: RouteConfig[];
}

function RouteWithSubRoutes(route: RouteConfig) {
    return (
        <Route
            path={route.path}
            render={(props) => (
                <route.component {...props}>{route.routes && renderRouter(route.routes)}</route.component>
            )}
        />
    );
}

const renderRouter = (routes: RouteConfig[]) => {
    return (
        <Switch>
            {routes.map((route, i) => (
                <RouteWithSubRoutes key={i} {...route} />
            ))}
        </Switch>
    );
};

const routes: RouteConfig[] = [];

export default function RouteRoot() {
    return <Router>{renderRouter(routes)}</Router>;
}
