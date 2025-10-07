import { ReactNode } from "react";
import { genericMemo } from "../utils/react";

type FallbackProps = {
    children: ReactNode;
};

const FallbackComponent = ({ children }: FallbackProps) => {
    return <>{children}</>;
};

export const Fallback = genericMemo(FallbackComponent);
Fallback.displayName = "Fallback";
