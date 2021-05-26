import React, { Component, FunctionComponent, PropsWithChildren } from "react";
import { Link } from "react-router-dom";

export default ({ children }: PropsWithChildren<{}>) => {
    return (
        <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ flex: 0 }}>
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
                <Link to="/article">artilceList</Link>
                <br />
                <Link to="/article/aaa">artilceId</Link>
                <br />
                <Link to="/articleaaaa">articleaaaa</Link>
                <br />
                <Link to="/pagesaaaa">pagesaaaa</Link>
            </div>
            <div style={{ flex: 1 }}>{children}</div>
        </div>
    );
};
