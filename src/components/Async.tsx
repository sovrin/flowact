import React, { useState, useEffect, ReactNode } from "react";
import { genericMemo } from "../utils/react";
import { Only } from "./Only";
import { Fallback } from "./Fallback";

type AsyncProps<T> = {
    promise: Promise<T> | (() => Promise<T>);
    children: ReactNode;
    loading?: ReactNode;
    error?: (error: Error) => ReactNode;
};

const AsyncComponent = <T,>({
    promise,
    children,
    error = (err) => <div>Error: {err.message}</div>,
}: AsyncProps<T>) => {
    const [state, setState] = useState<{
        status: "loading" | "success" | "error";
        data?: T;
        error?: Error;
    }>({ status: "loading" });

    useEffect(() => {
        const executePromise =
            typeof promise === "function" ? promise() : promise;

        executePromise
            .then((data) => setState({ status: "success", data }))
            .catch((err) => setState({ status: "error", error: err }));
    }, [promise]);

    switch (state.status) {
        case "loading":
            return <Only of={Pending}>{children}</Only>;
        case "error":
            return (
                <Only of={Rejected} reason={state.error!}>
                    {children}
                </Only>
            );
        case "success":
            return (
                <Only of={Resolved} response={state.data}>
                    {children}
                </Only>
            );

        default:
            return <Only of={Fallback}>{children}</Only>;
    }
};

export const Pending = ({ children }) => <>{children}</>;
export const Resolved = <T,>(data: T) => <>{data}</>;
export const Rejected = (error: Error) => <>Error: {error.message}</>;

export const Async = genericMemo(AsyncComponent);
Async.displayName = "Async";
