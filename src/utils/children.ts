import { Children, Fragment, ReactElement, ReactNode } from "react";

const collectResults = (
    target: ReactElement[],
    source: ReactElement[],
): void => {
    for (let i = 0; i < source.length; i++) {
        target.push(source[i]);
    }
};

const shouldMatch = (
    childType: unknown,
    not: boolean,
    type?: unknown,
): boolean => {
    return not ? childType !== type : childType === type;
};

const getChildren = (props: any): ReactNode | undefined => {
    return props.children;
};

const isValid = (child: any): child is ReactElement => {
    return child?.props !== undefined && child?.type !== undefined;
};

export const traverse = (
    nodes: ReactNode,
    not: boolean = false,
    type?: unknown,
): ReactElement[] => {
    const context: ReactElement[] = [];

    Children.forEach(nodes, (child) => {
        if (!isValid(child)) return;

        const childType = child.type;
        const children = getChildren(child.props);

        if (childType === Fragment) {
            if (children) {
                collectResults(context, traverse(children, not, type));
            }

            return;
        }

        if (shouldMatch(childType, not, type)) {
            context.push(child);
        }

        if (children) {
            collectResults(context, traverse(children, not, type));
        }
    });

    return context;
};
