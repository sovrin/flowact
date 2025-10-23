import {
    ComponentType,
    createElement,
    Fragment,
    ReactElement,
    ReactNode,
    useMemo,
} from "react";
import { Only } from "./Only";
import { Fallback } from "./Fallback";
import { extractContainer, genericMemo } from "../utils/react";

export type ItemType<T> = {
    item: T;
    index: number;
};

export type TypedItem<T> = ComponentType<{
    as?: ComponentType<ItemType<T>> | ReactElement;
}>;

type ForEachBaseProps<T> = {
    of: T[];
    identifier?: (item: T, index: number) => string | number;
};

type WithRenderProp<T> = ForEachBaseProps<T> & {
    children: (props: { Item: TypedItem<T> }) => ReactNode;
};

type WithStaticChildren<T> = ForEachBaseProps<T> & {
    children: ReactNode;
};

type ForEachProps<T> = WithRenderProp<T> | WithStaticChildren<T>;

type ItemWithRenderProp<T> = {
    children: (data: { item: T; index: number }) => ReactNode;
    as?: never;
};

type ItemWithComponent<T> = {
    as: ComponentType<{ item: T; index: number; [key: string]: unknown }>;
    children?: never;
};

type ItemWithStaticChildren = {
    children?: ReactNode;
    as?: never;
};

type ItemProps<T> =
    | ItemWithRenderProp<T>
    | ItemWithComponent<T>
    | ItemWithStaticChildren;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Item = <T,>(props: ItemProps<T>) => {
    return null;
};

const getItemComponents = <T,>(
    children: ReactNode | ((props: { Item: TypedItem<T> }) => ReactNode),
) => {
    return extractContainer(
        children,
        { Item },
        Item,
        ["as", "children"],
        ({ as, children }) => as || children,
    );
};

const ForEachComponent = <T,>({
    children,
    of,
    identifier,
}: ForEachProps<T>) => {
    const components = useMemo(
        () => getItemComponents<T>(children),
        [children],
    );

    const renderedItems = useMemo(() => {
        if (of.length === 0) {
            return null;
        }

        return of.map((item, index) => {
            const key =
                typeof identifier === "function"
                    ? identifier(item, index)
                    : index;

            const rendered = components.map((Component) => {
                return createElement(Component, {
                    item,
                    index,
                    key,
                });
            });

            return <Fragment key={key}>{rendered}</Fragment>;
        });
    }, [of, components, identifier]);

    if (of?.length === 0 || !renderedItems) {
        return <Only of={Fallback}>{children}</Only>;
    }

    return <>{renderedItems}</>;
};

const MemoizedForEach = genericMemo(ForEachComponent);
type MemoizedForEachType = typeof MemoizedForEach;

interface ForEachType extends MemoizedForEachType {
    Item: typeof Item;
}

export const ForEach = MemoizedForEach as ForEachType;
ForEach.Item = Item;
ForEach.displayName = "ForEach";
