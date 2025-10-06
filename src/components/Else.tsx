import React from "react";

type ElseProps = {
    children: React.ReactNode;
};

export const Else = ({ children }: ElseProps) => {
    return <>{children}</>;
};
