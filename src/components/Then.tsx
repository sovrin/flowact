import { ReactNode } from "react";

type ThenProps = {
    children: ReactNode;
};

export const Then = ({ children }: ThenProps) => {
    return <>{children}</>;
};
