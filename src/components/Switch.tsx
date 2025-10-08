import {
    Children,
    ComponentType,
    isValidElement,
    ReactElement,
    ReactNode,
    useMemo,
} from "react";
import { genericMemo, unpackFragment } from "../utils/react";
import { Only } from "./Only";
import { traverse } from "../utils/children";
import { Default } from "./Default";

type CaseProps = {
    when: unknown;
    children: ReactNode;
};

const CaseComponent = ({ children }: CaseProps) => <>{children}</>;

export const Case = genericMemo(CaseComponent);
Case.displayName = "Case";

type TypedCase<T> = ComponentType<{
    when: T;
    children: ReactNode;
}>;

type CaseBaseProps<T> = {
    value: T;
};

type SwitchProps<T> = WithRenderProp<T> | WithStaticChildren<T>;

type WithRenderProp<T> = CaseBaseProps<T> & {
    children: (props: {
        Case: TypedCase<T>;
        Default: typeof Default;
    }) => ReactNode;
};

type WithStaticChildren<T> = CaseBaseProps<T> & {
    children: ReactNode;
};

const SwitchComponent = <T,>({ value, children }: SwitchProps<T>) => {
    let childrenArray: ReactNode[] = [];

    if (typeof children === "function") {
        const TypedCase = useMemo(() => Case as TypedCase<T>, []);
        children = traverse(
            children({ Case: TypedCase, Default }),
            false,
            Case,
        );
    }

    childrenArray = Children.toArray(children).flatMap(unpackFragment);

    const matchingCase = childrenArray.find(
        (
            child,
        ): child is ReactElement<{
            when: any;
            children: ReactNode;
        }> =>
            isValidElement(child) &&
            child.type === Case &&
            child.props.when === value,
    );

    if (matchingCase) {
        return <>{matchingCase.props.children}</>;
    }

    return <Only of={Default}>{childrenArray}</Only>;
};

export const Switch = genericMemo(SwitchComponent);
Switch.displayName = "Switch";
