import React, {
    Children,
    Fragment,
    isValidElement,
    JSX,
    memo,
    ReactNode,
} from "react";

export const genericMemo: <
    T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>,
>(
    component: T,
    propsAreEqual?: (
        prevProps: React.ComponentProps<T>,
        nextProps: React.ComponentProps<T>,
    ) => boolean,
) => T & { displayName?: string } = memo;

export const unpackFragment = (node: ReactNode): ReactNode[] => {
    if (!isValidElement(node)) {
        return [node];
    }

    if (node.type === Fragment) {
        const children = node?.props?.children;

        return Children.toArray(children);
    }

    // Not a Fragment, return as-is
    return [node];
};
