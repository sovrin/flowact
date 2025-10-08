import { ReactNode, JSX, ComponentType } from "react";
import { ChildrenFilter } from "./ChildrenFilter";
import { genericMemo } from "../utils/react";

type OnlyProps = {
    of: ComponentType<never> | keyof JSX.IntrinsicElements;
    children: ReactNode;
};

const OnlyComponent = ({ children, of, ...rest }: OnlyProps) => {
    return (
        <ChildrenFilter of={of} not={false} {...rest}>
            {children}
        </ChildrenFilter>
    );
};

export const Only = genericMemo(OnlyComponent);
Only.displayName = "Only";
