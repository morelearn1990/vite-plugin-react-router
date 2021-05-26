import React, { Component, FunctionComponent, PropsWithChildren } from "react";

export default ({ children }: PropsWithChildren<{}>) => {
    return (
        <div>
            system layout
            <div>{children}</div>
        </div>
    );
};
