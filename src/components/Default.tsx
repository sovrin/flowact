import { ReactNode } from "react";
import { genericMemo } from "../utils/react";

type DefaultProps = {
    children: ReactNode;
};

const DefaultComponent = ({ children }: DefaultProps) => {
    return <>{children}</>;
};

export const Default = genericMemo(DefaultComponent);
Default.displayName = "Default";
