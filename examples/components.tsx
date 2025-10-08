import { ItemType } from "../src/components/ForEach/item";
import { UserType } from "./types";

export const UserItem = ({
    item: user,
    index,
    ...rest
}: ItemType<UserType>) => (
    <div className="user-card" {...rest}>
        {'"'}
        {user.name}
        {'"-"'}
        {user.email}
        {'", #'}
        {index}
    </div>
);

export const ListItem = ({ item, index, ...rest }: ItemType<number>) => (
    <div className="number-card" {...rest}>
        {'"'}
        {item}
        {'", #'}
        {index}
    </div>
);
