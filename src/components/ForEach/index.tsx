import {
    cloneElement,
    Fragment,
    isValidElement,
    ReactNode,
    useCallback,
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

const ForEachComponent = <T,>({
    children,
    of,
    identifier = (_, index) => index,
}: ForEachProps<T>) => {
    const memoizedIdentifier = useCallback(identifier, [identifier]);

    if (of?.length === 0 && isValidElement(children)) {
        return <Only of={Fallback}>{children}</Only>;
    }

    const renderStaticItems = useMemo(() => {
        if (typeof children === "function") return null;

        return traverse(children, false, Item);
    }, [children]);

    const TypedItem = useMemo(() => Item as TypedItem<T>, []);
    const renderItem = useCallback(
        (item: T, index: number) => {
            const key = memoizedIdentifier(item, index);
            const baseChildren =
                typeof children === "function"
                    ? traverse(children({ Item: TypedItem }), false, Item)
                    : renderStaticItems;

            const renderedChildren = baseChildren!.map((child, childIndex) =>
                cloneElement(child, { item, index, key: childIndex } as object),
            );

            return <Fragment key={key}>{renderedChildren}</Fragment>;
        },
        [memoizedIdentifier, renderStaticItems, children, TypedItem],
    );

    return <>{of.map(renderItem)}</>;
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
