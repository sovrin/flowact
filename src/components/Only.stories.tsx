import type { Meta, StoryObj } from "@storybook/react-vite";

import { Only } from "./Only";
import { Fragment } from "react";

const meta = {
    title: "Only",
    component: Only,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Only>;

export default meta;
type Story = StoryObj<typeof meta>;

const One = () => <div>one</div>;
const Two = () => <div>two</div>;
const Three = () => <div>three</div>;

export const Default: Story = {
    args: {
        of: One,
        children: (
            <Fragment>
                <One />
                <Two />
                <Three />
            </Fragment>
        ),
    },
};
