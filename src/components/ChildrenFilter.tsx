import {
    Children,
    cloneElement,
    ComponentType,
    isValidElement,
    JSX,
    ReactElement,
    ReactNode,
} from "react";
import { traverse } from "../utils/children";
import { genericMemo, unpackFragment } from "../utils/react";

type ChildrenFilterProps = {
    children: ReactNode;
    of: ComponentType<never> | keyof JSX.IntrinsicElements;
    not?: boolean;
};

const ChildrenFilterComponent = ({
    children,
    of,
    not = false,
    ...rest
}: ChildrenFilterProps) => {
    children = Children.toArray(children).flatMap(unpackFragment);

    const candidates: ReactElement[] = traverse(children, not, of);
    if (!candidates.length) {
        return undefined;
    }

    return candidates.map((candidate, i) => {
        return isValidElement(candidate)
            ? cloneElement(candidate, {
                  key: i,
                  ...rest,
              })
            : candidate;
    });
};

export const ChildrenFilter = genericMemo(ChildrenFilterComponent);
ChildrenFilter.displayName = "ChildrenFilter";
