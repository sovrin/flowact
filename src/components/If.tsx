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

const MemoizedIf = genericMemo(IfComponent);
type MemoizedIfType = typeof MemoizedIf;

interface IfType extends MemoizedIfType {
    Then: typeof Then;
    Else: typeof Else;
}

export const If = MemoizedIf as IfType;
If.Then = Then;
If.Else = Else;
If.displayName = "If";

export { Then } from "./Then";
export { Else } from "./Else";
