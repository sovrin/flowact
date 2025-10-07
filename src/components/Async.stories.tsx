import type { Meta, StoryObj } from "@storybook/react-vite";

import { Async, Pending, Rejected, Resolved } from "./Async";
import { Fragment } from "react";
import { Fallback } from "./Fallback";

const meta = {
    title: "Async",
    component: Async,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Async>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        promise: new Promise((resolve) => {}),
        children: (
            <Fragment>
                <Pending />
                <Rejected />
                <Resolved />
                <Fallback />
            </Fragment>
        ),
    },
};
