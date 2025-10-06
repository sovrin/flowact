import React, {
    cloneElement,
    Fragment,
    memo,
    useCallback,
    useMemo,
    JSX,
} from "react";
import { Only } from "./Only";
import { Fallback } from "./Fallback";
import { traverse } from "../utils/children";

type BaseItemProps<T> = {
    item?: T;
    index?: number;
    [key: string]: any;
};

type ItemWithRenderProp<T> = BaseItemProps<T> & {
    children: (data: { item: T; index: number }) => React.ReactNode;
    as?: never;
};

type ItemWithComponent<T> = BaseItemProps<T> & {
    as: React.ComponentType<{ item: T; index: number; [key: string]: any }>;
    children?: never;
};

type ItemWithStaticChildren<T> = BaseItemProps<T> & {
    children?: React.ReactNode;
    as?: never;
};

type ItemProps<T> =
    | ItemWithRenderProp<T>
    | ItemWithComponent<T>
    | ItemWithStaticChildren<T>;

type ForEachProps<T> = {
    children: React.ReactNode;
    items: T[];
    identifier?: (item: T, index: number) => string | number;
};

export const Item = memo(
    <T,>({
        children,
        as: Component,
        item,
        index,
        ...restProps
    }: ItemProps<T>) => {
        if (item === undefined || index === undefined) {
            return null;
        }

        if (typeof children === "function") {
            return <>{children({ item, index, ...restProps })}</>;
        }

        if (Component) {
            return <Component item={item} index={index} {...restProps} />;
        }

        return <>{children}</>;
    },
) as <T>(props: ItemProps<T>) => JSX.Element | null;

export const ForEach = <T,>({
    children,
    items,
    identifier = (_, index) => index,
}: ForEachProps<T>) => {
    const memoizedIdentifier = useCallback(identifier, [identifier]);

    const renderItems = useMemo(() => {
        return traverse(children, false, Item);
    }, [children]);

    const isEmpty = useMemo(() => !items?.length, [items?.length]);

    const renderItem = useCallback(
        (item: T, index: number) => {
            const key = memoizedIdentifier(item, index);
            const children = renderItems.map((child, childIndex) => {
                return cloneElement(child as React.ReactElement<any>, {
                    item,
                    index,
                    key: childIndex,
                });
            });

            return <Fragment key={key}>{children}</Fragment>;
        },
        [memoizedIdentifier, renderItems],
    );

    if (isEmpty) {
        return <Only of={Fallback}>{children}</Only>;
    }

    return <>{items.map(renderItem)}</>;
};
