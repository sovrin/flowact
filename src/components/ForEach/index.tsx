import { cloneElement, Fragment, ReactNode, useCallback, useMemo } from "react";
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

    const TypedItem = useMemo(() => Item as TypedItem<T>, []);

    const renderItems = useMemo(() => {
        if (typeof children === "function") {
            return null;
        }

        return traverse(children, false, Item);
    }, [children]);

    const isEmpty = useMemo(() => !of?.length, [of?.length]);

    const renderItem = useCallback(
        (item: T, index: number) => {
            const key = memoizedIdentifier(item, index);

            if (typeof children === "function") {
                const renderedContent = children({ Item: TypedItem });
                return (
                    <Fragment key={key}>
                        {traverse(renderedContent, false, Item).map(
                            (child, childIndex) => {
                                return cloneElement(child, {
                                    item,
                                    index,
                                    key: childIndex,
                                } as object);
                            },
                        )}
                    </Fragment>
                );
            }

            const itemChildren = renderItems!.map((child, childIndex) => {
                return cloneElement(child, {
                    item,
                    index,
                    key: childIndex,
                } as object);
            });

            return <Fragment key={key}>{itemChildren}</Fragment>;
        },
        [memoizedIdentifier, renderItems, children, TypedItem],
    );

    if (isEmpty) {
        return <Only of={Fallback}>{children}</Only>;
    }

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
ForEach.displayName = "ForEach";
