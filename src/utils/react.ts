import React, {
    Children,
    ComponentType,
    Fragment,
    JSX,
    memo,
    ReactElement,
    ReactNode,
} from "react";
import { traverse } from "./children";

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
    if (!isValid(node)) {
        return [node];
    }

    if (node.type === Fragment) {
        const children = node?.props?.children;

        return Children.toArray(children);
    }

    // Not a Fragment, return as-is
    return [node];
};

const isValid = (child: any): child is ReactElement => {
    return child?.props !== undefined;
};

export function extractChildProps<T extends Record<keyof T, unknown>>(
    child: ReactElement<T>,
    propNames: (keyof T)[],
): Partial<T> {
    if (!isValid(child)) {
        return {};
    }

    const extractedProps: Partial<Record<keyof T, unknown>> = {};
    propNames.forEach((name) => {
        if (name in child.props) {
            extractedProps[name] = child.props[name];
        }
    });

    return extractedProps as Partial<T>;
}

export function extractChildrenProps<
    T extends Partial<Record<keyof T, unknown>>,
>(children: ReactNode, propNames: (keyof T)[]): Array<Partial<T>> {
    const childArray = Array.isArray(children) ? children : [children];

    return childArray.map((child) => extractChildProps<T>(child, propNames));
}

export const extractContainer = <TComponent extends ComponentType<any>, TProps>(
    children: ReactNode | ((injectedProps: any) => ReactNode),
    injectedProps: any,
    targetComponent: TComponent,
    propKeys: string[],
    selector: (props: any) => any,
) => {
    const content =
        typeof children === "function" ? children(injectedProps) : children;

    const items = traverse(content, false, targetComponent);

    return extractChildrenProps(items, propKeys).map(selector);
};
