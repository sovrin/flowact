import type { Meta, StoryObj } from "@storybook/react-vite";

import { If } from "./If";
import { Else } from "./Else";
import { Then } from "./Then";

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
};

export const False: Story = {
    args: {
        condition: false,
        children: <Else>{"condition is false, showing of <Else/>"}</Else>,
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
};
