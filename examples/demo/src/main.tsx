import React from "react";
import ReactDOM from "react-dom";
import RouteRoot from "virtual:generated-routes";
import "./index.css";
import App from "./App";

// console.log("files", files);

ReactDOM.render(
    <React.StrictMode>
        <App />
        <RouteRoot />
    </React.StrictMode>,
    document.getElementById("root")
);
