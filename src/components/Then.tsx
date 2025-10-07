import { ReactNode } from "react";
import { genericMemo } from "../utils/react";

type ThenProps = {
    children: ReactNode;
};

const ThenComponent = ({ children }: ThenProps) => {
    return <>{children}</>;
};

export const Then = genericMemo(ThenComponent);
Then.displayName = "Then";
