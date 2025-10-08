import { ComponentType, ReactElement, ReactNode } from "react";
import { genericMemo } from "../../utils/react";

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

export type ItemType<T> = {
    item: T;
    index: number;
};

export type TypedItem<T> = ComponentType<{
    as?: ComponentType<ItemType<T>> | ReactElement;
}>;

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

export const Item = genericMemo(ItemComponent);
Item.displayName = "Item";
