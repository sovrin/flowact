import { ReactNode } from "react";
import { genericMemo } from "../utils/react";

type ElseProps = {
    children: ReactNode;
};

const ElseComponent = ({ children }: ElseProps) => {
    return <>{children}</>;
};

export const Else = genericMemo(ElseComponent);
Else.displayName = "Else";
