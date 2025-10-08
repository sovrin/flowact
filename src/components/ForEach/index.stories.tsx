import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent } from "storybook/test";

import { ForEach, Item } from "./index";
import { Fallback } from "../Fallback";
import { ListItem, UserItem } from "../../../examples/components";
import { UserType } from "../../../examples/types";
import { Fragment, ReactNode } from "react";

const meta = {
    title: "ForEach",
    component: ForEach,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof ForEach>;

export default meta;
type Story = StoryObj<typeof meta>;

const USERS: UserType[] = [
    {
        name: "Jon Doe",
        email: "jon@example.com",
    },
    {
        name: "Jane Doe",
        email: "jane@example.com",
    },
];

export const Default: Story = {
    args: {
        of: USERS,
        children: <Item as={UserItem} />,
    },
    play: async ({ canvas }) => {
        await expect(
            canvas.getByText('"Jon Doe"-"jon@example.com", #0'),
        ).toBeVisible();
        await expect(
            canvas.getByText('"Jane Doe"-"jane@example.com", #1'),
        ).toBeVisible();
    },
};

export const WithInlineRender: Story = {
    args: {
        of: USERS,
        children: (
            <Item<UserType>
                as={({ item, index }) => (
                    <div>
                        {'"'}
                        {item.name}
                        {'"-"'}
                        {item.email}
                        {'", #'}
                        {index}
                    </div>
                )}
            />
        ),
    },
    play: async ({ canvas }) => {
        await expect(
            canvas.getByText('"Jon Doe"-"jon@example.com", #0'),
        ).toBeVisible();
        await expect(
            canvas.getByText('"Jane Doe"-"jane@example.com", #1'),
        ).toBeVisible();
    },
};

export const WithRenderProp: Story = {
    args: {
        of: USERS,
        children: <Item<UserType>>{UserItem}</Item>,
    },
    play: async ({ canvas }) => {
        await expect(
            canvas.getByText('"Jon Doe"-"jon@example.com", #0'),
        ).toBeVisible();
        await expect(
            canvas.getByText('"Jane Doe"-"jane@example.com", #1'),
        ).toBeVisible();
    },
};

export const WithFallback: Story = {
    args: {
        of: [],
        children: (
            <Fragment>
                <Fallback>No users available</Fallback>
                <Item<UserType>>{UserItem}</Item>
            </Fragment>
        ),
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByText("No users available")).toBeVisible();
    },
};

export const WithTypedItem: Story = {
    args: {
        of: USERS,
        children: null,
    },
    render: (args) => {
        return (
            <ForEach of={args?.of as UserType[]}>
                {({ Item }) => <Item as={UserItem} />}
            </ForEach>
        );
    },
    play: async ({ canvas }) => {
        await expect(
            canvas.getByText('"Jon Doe"-"jon@example.com", #0'),
        ).toBeVisible();
        await expect(
            canvas.getByText('"Jane Doe"-"jane@example.com", #1'),
        ).toBeVisible();
    },
};
export const WithRestParameters: Story = {
    args: {
        of: USERS,
        children: <Fallback>fallback hello</Fallback>,
    },
    render: (args) => {
        return (
            <ForEach of={args?.of}>
                <Item<UserType> as={UserItem} />
                {args?.children as ReactNode}
            </ForEach>
        );
    },
    play: async ({ canvas }) => {
        await expect(
            canvas.getByText('"Jon Doe"-"jon@example.com", #0'),
        ).toBeVisible();
        await expect(
            canvas.getByText('"Jane Doe"-"jane@example.com", #1'),
        ).toBeVisible();
    },
};

export const WithStatics: Story = {
    args: {
        of: USERS,
        children: <ForEach.Item as={UserItem} />,
    },
    play: async ({ canvas }) => {
        await expect(
            canvas.getByText('"Jon Doe"-"jon@example.com", #0'),
        ).toBeVisible();
        await expect(
            canvas.getByText('"Jane Doe"-"jane@example.com", #1'),
        ).toBeVisible();
    },
};
