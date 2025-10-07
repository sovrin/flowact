import {
    Children,
    cloneElement,
    ComponentProps,
    Fragment,
    HTMLAttributes,
    isValidElement,
    JSXElementConstructor,
    ReactElement,
    ReactNode,
} from "react";
import { traverse } from "../utils/children";
import { genericMemo, unpackFragment } from "../utils/react";

type ComponentType = JSXElementConstructor<unknown>;
type HTMLTag = keyof HTMLElementTagNameMap;

type Props<T extends ComponentType> = {
    children: ReactNode;
    type: T | HTMLTag;
    not?: boolean;
} & ComponentProps<T> &
    ComponentProps<HTMLTag> &
    HTMLAttributes<HTMLElement>;

const ChildrenFilterComponent = <T extends ComponentType>({
    children,
    type,
    not = false,
    ...rest
}: Props<T>) => {
    children = Children.toArray(children).flatMap(unpackFragment);

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

export const ChildrenFilter = genericMemo(ChildrenFilterComponent);
ChildrenFilter.displayName = "ChildrenFilter";
