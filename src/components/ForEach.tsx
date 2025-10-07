import {
    cloneElement,
    ComponentType,
    Fragment,
    ReactNode,
    useCallback,
    useMemo,
} from "react";
import { Only } from "./Only";
import { Fallback } from "./Fallback";
import { traverse } from "../utils/children";
import { genericMemo } from "../utils/react";

type ItemWithRenderProp<T> = {
    children: (data: { item: T; index: number }) => ReactNode;
    as?: never;
};

type ItemWithComponent<T> = {
    as: ComponentType<{ item: T; index: number; [key: string]: any }>;
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

const ItemComponent = <T,>({
    children,
    as: Component,
    ...restProps
}: ItemProps<T>) => {
    if (typeof children === "function") {
        return <>{children({ ...restProps } as never)}</>;
    }

    if (Component) {
        // @ts-ignore
        return <Component {...restProps} />;
    }

    return <>{children}</>;
};

export type ItemType<T> = {
    item: T;
    index: number;
};

export const Item = genericMemo(ItemComponent);
Item.displayName = "Item";

type ForEachProps<T> = {
    children?: ReactNode;
    items: T[];
    identifier?: (item: T, index: number) => string | number;
};

const ForEachComponent = <T,>({
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
                return cloneElement(child, {
                    item,
                    index,
                    key: childIndex,
                } as object);
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

export const ForEach = genericMemo(ForEachComponent);
ForEach.displayName = "ForEach";
