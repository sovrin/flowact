import type { Meta, StoryObj } from "@storybook/react-vite";

import { Case, Switch } from "./Switch";
import { Fallback } from "./Fallback";
import { Fragment } from "react";
import { expect } from "storybook/test";

const meta = {
    title: "Switch",
    component: Switch,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        value: { control: "select", options: [1, 2, 3, undefined] },
    },
    tags: ["autodocs"],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        value: 1,
    },
    render: ({ value }) => (
        <Switch value={value}>
            <Case when={1}>one</Case>
            <Case when={2}>two</Case>
            <Case when={3}>three</Case>
        </Switch>
    ),
    play: async ({ canvas }) => {
        await expect(canvas.getByText("one")).toBeVisible();
    },
};

export const WithFallback: Story = {
    args: {
        value: null,
    },
    render: ({ value }) => (
        <Switch value={value}>
            <Fallback>none</Fallback>
            <Case when={1}>one</Case>
            <Case when={2}>two</Case>
            <Case when={3}>three</Case>
        </Switch>
    ),
    play: async ({ canvas }) => {
        await expect(canvas.getByText("none")).toBeVisible();
    },
};

export const WithRenderProp: Story = {
    args: {
        value: 2,
        children: ({ Case }) => (
            <Fragment>
                <Case when={1}>one</Case>
                <Case when={2}>two</Case>
                <Case when={3}>three</Case>
            </Fragment>
        ),
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByText("two")).toBeVisible();
    },
};

export const InsideFragment: Story = {
    args: {
        value: 1,
        children: (
            <Fragment>
                <Case when={1}>one</Case>
                <Case when={2}>two</Case>
                <Case when={3}>three</Case>
            </Fragment>
        ),
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByText("one")).toBeVisible();
    },
};
