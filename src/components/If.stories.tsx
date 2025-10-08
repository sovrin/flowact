import type { Meta, StoryObj } from "@storybook/react-vite";

import { If } from "./If";
import { Else } from "./Else";
import { Then } from "./Then";
import { expect } from "storybook/test";

const meta = {
    title: "If",
    component: If,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof If>;

export default meta;
type Story = StoryObj<typeof meta>;

export const True: Story = {
    args: {
        condition: true,
        children: (
            <Then>{"condition is true, showing content of <Then/>"}</Then>
        ),
    },
    play: async ({ canvas }) => {
        await expect(
            canvas.getByText("condition is true, showing content of <Then/>"),
        ).toBeVisible();
    },
};

export const False: Story = {
    args: {
        condition: false,
        children: <Else>{"condition is false, showing of <Else/>"}</Else>,
    },
    play: async ({ canvas }) => {
        await expect(
            canvas.getByText("condition is false, showing of <Else/>"),
        ).toBeVisible();
    },
};

export const WithElse: Story = {
    args: {
        condition: false,
        children: (
            <>
                <Then>{"<Then/> content"}</Then>
                <Else>{"<Else/> content"}</Else>
            </>
        ),
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByText("<Else/> content")).toBeVisible();
    },
};

export const WithStatics: Story = {
    args: {
        condition: false,
        children: (
            <>
                <If.Then>{"<Then/> content"}</If.Then>
                <If.Else>{"<Else/> content"}</If.Else>
            </>
        ),
    },
    play: async ({ canvas }) => {
        await expect(canvas.getByText("<Else/> content")).toBeVisible();
    },
};
