# flowact (flow react)
a naive attempt of declarative reactjs components for data flow

## About
Reactjs often falls short in terms of declarative programming. The current _way-to-go_ is not completely satisfying.
I want to tackle this dissatisfaction with tailored and slightly opinionated components.

## Examples

```typescript jsx
import {ForEach, Item} from "./index";

const USERS = ['Jon', 'Jane'];
const Name = ({item: name}) => <div>{name}</div>;

<ForEach of={USERS}>
    <Item as={Name}/>
</ForEach>
```

or a typed (but less declarative) version
```typescript jsx
import {ForEach, Item} from "./index";

const USERS = ['Jon', 'Jane'];
const Name = ({item: name}) => <div>{name}</div>;

<ForEach of={USERS}>
    {({Item}) => (
        <Item as={Name}/>
    )}
</ForEach>
```

```typescript jsx
import {If, Then, Else} from "./index";

<If condition={true}>
    <Then>I will be rendered</Then>
    <Else>I won't</Else>
</If>
```

```typescript jsx
import {Switch, Case, Default} from "./index";

<Switch value={3}>
    <Default>I will only be rendered, if nothing else matches</Default>
    <Case when={1}>I won't be rendered</Case>
    <Case when={2}>I won't be rendered</Case>
    <Case when={3}>I will be rendered</Case>
</Switch>
```

```typescript jsx
import {Only, Except} from "./index";

const Foo = () => <div>foo</div>;
    
<Only of={Foo}>
    <Foo/>                  // I will be rendered 
    <div>hello world</div>  // I won't be rendered
    <Foo/>                  // I will be rendered
</Only>

<Except of="div">
    <Foo/>                  // I won't be rendered
    <div>hello world</div>  // I will be rendered
    <Foo/>                  // I won't be rendered
</Except>
```
