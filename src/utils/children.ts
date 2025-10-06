import {
    Children,
    Fragment,
    isValidElement,
    ReactElement,
    ReactNode,
} from "react";

export const traverse = (
    nodes: ReactNode,
    not: boolean = false,
    type?: unknown,
): ReactElement[] => {
    const context: ReactElement[] = [];

    Children.forEach(nodes, (child) => {
        if (!isValidElement(child)) return;

        if (child.type === Fragment) {
            context.push(
                ...traverse(
                    (child.props as { children?: ReactNode }).children,
                    not,
                    type,
                ),
            );
            return;
        }

        const matches = not
            ? child && child.type !== type
            : child && child.type === type;

        if (matches) {
            context.push(child);
        }

        const childProps = child.props as { children?: ReactNode };
        if (childProps.children) {
            context.push(...traverse(childProps.children, not, type));
        }
    });

    return context;
};
