import {
    ComponentProps,
    HTMLAttributes,
    JSXElementConstructor,
    ReactNode,
} from "react";
import { ChildrenFilter } from "./ChildrenFilter";
import { genericMemo } from "../utils/react";
import { Prettify } from "../types";

type ComponentType = JSXElementConstructor<Record<string, unknown>>;

type HTMLTag = keyof HTMLElementTagNameMap;

type OnlyProps<T extends ComponentType | HTMLTag> = Prettify<
    {
        children: ReactNode;
        of: T;
    } & (T extends ComponentType ? ComponentProps<T> : Record<string, never>) &
        (T extends HTMLTag ? ComponentProps<T> : Record<string, never>) &
        HTMLAttributes<HTMLElement>
>;

const OnlyComponent = <T extends ComponentType>({
    children,
    of,
    ...rest
}: OnlyProps<T>) => {
    return (
        <ChildrenFilter type={of} not={false} {...rest}>
            {children}
        </ChildrenFilter>
    );
};

export const Only = genericMemo(OnlyComponent);
Only.displayName = "Only";
