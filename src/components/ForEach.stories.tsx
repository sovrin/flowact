import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { ForEach, Item, ItemType } from "./ForEach";
import { Fallback } from "./Fallback";
import { UserItem } from "../../examples/components";
import { UserType } from "../../examples/types";
import { Fragment, Profiler, ProfilerOnRenderCallback, ReactNode } from "react";

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
        identifier: (user) => user.name,
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

const Name = ({ item: { name }, index }: ItemType<{ name: string }>) => (
    <div>
        {name} #{index}
    </div>
);

const PERFORMANCE_USERS = Array.from({ length: 10000 }, (_, i) => ({
    name: `User ${i}`,
    email: `user${i}@example.com`,
}));

const onRenderCallback: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
) => {
    console.log(`[${id}] ${phase} phase:`);
    console.log(`  Actual duration: ${actualDuration.toFixed(2)}ms`);
    console.log(`  Base duration: ${baseDuration.toFixed(2)}ms`);
    console.log(`  Start time: ${startTime.toFixed(2)}ms`);
    console.log(`  Commit time: ${commitTime.toFixed(2)}ms`);
};

export const PerformanceForEachComponent: Story = {
    render: () => (
        <Profiler id="ForEach-Performance" onRender={onRenderCallback}>
            <ForEach of={PERFORMANCE_USERS}>
                <Item<UserType> as={Name} />
            </ForEach>
        </Profiler>
    ),
};

export const PerformanceNativeMap: Story = {
    render: () => (
        <Profiler id="Native-Map-Performance" onRender={onRenderCallback}>
            <>
                {PERFORMANCE_USERS.map((user, i) => (
                    <Name key={i} item={user} index={i} />
                ))}
            </>
        </Profiler>
    ),
};
