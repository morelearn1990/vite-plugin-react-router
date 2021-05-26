import React, { Component, FunctionComponent, PropsWithChildren } from "react";

export default ({ children }: PropsWithChildren<{}>) => {
    return (
        <div>
            article layout
            <div>{children}</div>
        </div>
    );
};
