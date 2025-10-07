import {
    cloneElement,
    ComponentType,
    Fragment,
    ReactElement,
    ReactNode,
    useCallback,
    useMemo,
} from "react";
import { Only } from "./Only";
import { Fallback } from "./Fallback";
import { traverse } from "../utils/children";
import { genericMemo } from "../utils/react";

type BaseItemProps<T> = {
    item?: T;
    index?: number;
    // ComponentProps?
};

type ItemWithRenderProp<T> = BaseItemProps<T> & {
    children: (data: { item: T; index: number }) => ReactNode;
    as?: never;
};

type ItemWithComponent<T> = BaseItemProps<T> & {
    as: ComponentType<{ item: T; index: number; [key: string]: any }>;
    children?: never;
};

type ItemWithStaticChildren<T> = BaseItemProps<T> & {
    children?: ReactNode;
    as?: never;
};

type ItemProps<T> =
    | ItemWithRenderProp<T>
    | ItemWithComponent<T>
    | ItemWithStaticChildren<T>;

const ItemComponent = <T,>({
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
                return cloneElement(child as ReactElement<any>, {
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

export const ForEach = genericMemo(ForEachComponent);
ForEach.displayName = "ForEach";
