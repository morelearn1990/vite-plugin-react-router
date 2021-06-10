import React from "react";
import ReactDOM from "react-dom";
import RouteRoot, { history } from "virtual:generated-routes";
import "./index.css";
import App from "./App";

// console.log("history", history);

ReactDOM.render(
    <React.StrictMode>
        <App />
        <RouteRoot />
    </React.StrictMode>,
    document.getElementById("root")
);
