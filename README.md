# use-fancy-input

> ⚠️ Not yet 1.0. Many things are subject to change. Documentation is a work in progress. Try it out and give feedback!

React hook for building fancy input for things like OTP, 2FA Code, etc.

Checkout the [Storybook](https://ceoshikhar.github.io/use-fancy-input) for examples.

## Demo

<img src="./demo.gif" />

#### Source code behind the GIF above

```tsx
import { useFancyInput } from "use-fancy-input";

const MyComponent = () => {
    const { containerRef, inputs } = useFancyInput({ length: 5 });

    return (
        <StyledDiv ref={containerRef}>
            {inputs.map((input) => {
                return <StyledInput {...input.getInputProps()} />;
            })}
        </StyledDiv>
    );
};
```

# Installation

```bash
npm install use-fancy-input
```

**OR**

```bash
yarn add use-fancy-input
```
