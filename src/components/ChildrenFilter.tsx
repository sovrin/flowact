import React, {
    cloneElement,
    isValidElement,
    JSXElementConstructor,
    ReactElement,
    ReactNode,
} from "react";
import { traverse } from "../utils/children";

type ComponentType = JSXElementConstructor<unknown>;
type HTMLTag = keyof HTMLElementTagNameMap;

type Props<T extends ComponentType> = {
    children: ReactNode;
    type: T | HTMLTag;
    not?: boolean;
} & React.ComponentProps<T> &
    React.ComponentProps<HTMLTag> &
    React.HTMLAttributes<HTMLElement>;

export const ChildrenFilter = <T extends ComponentType>({
    children,
    type,
    not = false,
    ...rest
}: Props<T>) => {
    const candidates: ReactElement[] = traverse(children, not, type);
    if (!candidates.length) {
        return undefined;
    }

    return candidates.map((candidate, i) => {
        const key = { key: i };

        return isValidElement(candidate)
            ? cloneElement(candidate, {
                  key,
                  ...rest,
              })
            : candidate;
    });
};
