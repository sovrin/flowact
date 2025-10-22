import {
    createElement,
    Fragment,
    isValidElement,
    ReactNode,
    useMemo,
} from "react";
import { Only } from "../Only";
import { Fallback } from "../Fallback";
import { Item, TypedItem } from "./item";
import { traverse } from "../../utils/children";
import { genericMemo } from "../../utils/react";

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

const getItemComponents = <T,>(
    children: ReactNode | ((props: { Item: TypedItem<T> }) => ReactNode),
) => {
    const content =
        typeof children === "function"
            ? children({ Item: Item as TypedItem<T> })
            : children;

    const items = traverse(content, false, Item);

    return items.map((item) => {
        const itemProps = item.props as { as?: any; children?: any };

        return itemProps.as || itemProps.children;
    });
};

const ForEachComponent = <T,>({
    children,
    of,
    identifier = (_, index) => index,
}: ForEachProps<T>) => {
    if (of?.length === 0 && isValidElement(children)) {
        return <Only of={Fallback}>{children}</Only>;
    }

    const components = useMemo(
        () => getItemComponents<T>(children),
        [children],
    );

    const renderedItems = useMemo(() => {
        return of.map((item, index) => {
            const key = identifier(item, index);

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

export { Item } from "./item";
