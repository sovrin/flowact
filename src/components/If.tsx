import React from "react";
import { Only } from "./Only";
import { Else } from "./Else";
import { Then } from "./Then";

type IfProps = {
    condition: boolean;
    children: React.ReactNode;
};

export const If = ({ condition, children }: IfProps) => {
    if (!condition) {
        return <Only of={Else}>{children}</Only>;
    }

    return <Only of={Then}>{children}</Only>;
};
