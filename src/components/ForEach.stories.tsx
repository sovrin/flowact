import type { Meta, StoryObj } from "@storybook/react-vite";

import { ForEach, Item } from "./ForEach";
import { Fallback } from "./Fallback";

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

export const Default: Story = {
    args: {
        items: ["Jon Doe", "Jane Doe"],
        children: null,
    },
    render: (args) => {
        return (
            <ForEach items={args?.items}>
                <Item<number>
                    as={({ item, index }) => (
                        <div>
                            item: {item}, index: {index}
                        </div>
                    )}
                />
            </ForEach>
        );
    },
};

type User = {
    name: string;
    email: string;
};

const UserCard = ({
    item: user,
    index,
    ...rest
}: {
    item: User;
    index: number;
}) => (
    <div {...rest}>
        <h3>User #{index + 1}</h3>
        <p>{user.name}</p>
        <p>{user.email}</p>
    </div>
);

export const AsRenderProp: Story = {
    args: {
        items: [
            {
                name: "Jon Doe",
                email: "jon@example.com",
            },
            {
                name: "Jane Doe",
                email: "jane@example.com",
            },
        ] as User[],
        children: <Fallback>fallback hello</Fallback>,
    },
    render: (args) => {
        return (
            <ForEach items={args?.items}>
                <Fallback>No users available</Fallback>
                <Item<User> className="product-highlight">{UserCard}</Item>
            </ForEach>
        );
    },
};
