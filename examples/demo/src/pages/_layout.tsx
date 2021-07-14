import React, { Component, FunctionComponent, PropsWithChildren } from "react";
import { Link } from "react-router-dom";

export default ({ children }: PropsWithChildren<{}>) => {
    console.log("adsfasdfasdf");
    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ flexShrink: 0, flexGrow: 0, width: 200 }}>
                <Link to="/">index</Link>
                <br />
                <Link to="/pages">pages</Link>
                <br />
                <Link to="/system">system</Link>
                <br />
                <Link to="/system/user">user</Link>
                <br />
                <Link to="/system/user/aaaa">user/aaaa</Link>
                <br />
                <Link to="/system/role">role</Link>
                <br />
                <Link to="/system/role/aaaa">option NotFound</Link>
                <br />
                <Link to="/article">artilceList</Link>
                <br />
                <Link to="/article/aaa">artilceId</Link>
                <br />
                <Link to="/articleaaaa">articleaaaa</Link>
                <br />
                <Link to="/pagesaaaa">dir 404</Link>
            </div>
            <div style={{ flex: 1 }}>{children}</div>
        </div>
    );
};
