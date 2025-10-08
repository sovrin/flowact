import { ComponentType, JSX, ReactNode } from "react";
import { ChildrenFilter } from "./ChildrenFilter";
import { genericMemo } from "../utils/react";

type ExceptProps = {
    of: ComponentType<never> | keyof JSX.IntrinsicElements;
    children: ReactNode;
};

export const ExceptComponent = ({ children, of, ...rest }: ExceptProps) => {
    return (
        <ChildrenFilter of={of} not={true} {...rest}>
            {children}
        </ChildrenFilter>
    );
};

export const Except = genericMemo(ExceptComponent);
Except.displayName = "Except";
