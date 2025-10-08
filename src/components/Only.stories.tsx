import type { Meta, StoryObj } from "@storybook/react-vite";

import { Only } from "./Only";
import { Fragment } from "react";
import { expect } from "storybook/test";

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
        of: Two,
        children: (
            <Fragment>
                <One />
                <Two />
                <Three />
            </Fragment>
        ),
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByText("two")).toBeVisible();
    },
};

export const WithIntrinsicElement: Story = {
    args: {
        of: "div",
        children: (
            <Fragment>
                <One />
                <div>{"hello"}</div>
                <div>{"world"}</div>
                <Two />
            </Fragment>
        ),
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByText("hello")).toBeVisible();
        await expect(canvas.getByText("world")).toBeVisible();
    },
};
