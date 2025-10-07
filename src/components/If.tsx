import { ReactNode } from "react";
import { Only } from "./Only";
import { Else } from "./Else";
import { Then } from "./Then";
import { genericMemo } from "../utils/react";

type IfProps = {
    condition: boolean;
    children: ReactNode;
};

const IfComponent = ({ condition, children }: IfProps) => {
    if (!condition) {
        return <Only of={Else}>{children}</Only>;
    }

    return <Only of={Then}>{children}</Only>;
};

export const If = genericMemo(IfComponent);
If.displayName = "If";
