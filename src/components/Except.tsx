import React, { JSXElementConstructor, ReactNode } from "react";
import { ChildrenFilter } from "./ChildrenFilter";

type ComponentType = JSXElementConstructor<any>;

type HTMLTag = keyof HTMLElementTagNameMap;

type Props<T extends ComponentType | HTMLTag> = {
    children: ReactNode;
    of: T;
} & (T extends ComponentType ? React.ComponentProps<T> : {}) &
    (T extends HTMLTag ? React.ComponentProps<T> : {}) &
    React.HTMLAttributes<HTMLElement>;

export const Except = <T extends ComponentType>({
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
