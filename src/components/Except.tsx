import {
    ComponentProps,
    HTMLAttributes,
    JSXElementConstructor,
    ReactNode,
} from "react";
import { ChildrenFilter } from "./ChildrenFilter";
import { genericMemo } from "../utils/react";

type ComponentType = JSXElementConstructor<any>;

type HTMLTag = keyof HTMLElementTagNameMap;

type Props<T extends ComponentType | HTMLTag> = {
    children: ReactNode;
    of: T;
} & (T extends ComponentType ? ComponentProps<T> : any) &
    (T extends HTMLTag ? ComponentProps<T> : any) &
    HTMLAttributes<HTMLElement>;

export const ExceptComponent = <T extends ComponentType>({
    children,
    of,
    ...rest
}: Props<T>) => {
    return (
        <ChildrenFilter type={of} not={true} {...rest}>
            {children}
        </ChildrenFilter>
    );
};

export const Except = genericMemo(ExceptComponent);
Except.displayName = "Except";
