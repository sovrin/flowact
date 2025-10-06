import { ReactNode } from "react";

type FallbackProps = {
    children: ReactNode;
};

export const Fallback = ({ children }: FallbackProps) => {
    return <>{children}</>;
};
