# use-fancy-input

React hook for building fancy input for things like OTP, 2FA Code, etc.

Documentation is 🚧 but the hook is 🚀

### ⚠️ API will be stable after v1.0.0 until then consider it **not** production ready.

## Demo

<img src="./demo.gif" />

#### Source code behind the GIF above

```tsx
import { useFancyInput } from "use-fancy-input";

const MyComponent = () => {
    const { containerRef, inputs, value } = useFancyInput({ length: 5 });

    return (
        <>
            <h3>Unstyled</h3>
            <ul ref={containerRef}>
                {inputs.map((input) => {
                    const { key, ...props } = input.getInputProps();
                    return (
                        <li key={key}>
                            <input {...props} />
                        </li>
                    );
                })}
            </ul>

            <h3>Styled</h3>
            <StyledDiv ref={containerRef}>
                {inputs.map((input) => {
                    return <StyledInput {...input.getInputProps()} />;
                })}
            </StyledDiv>

            <pre>
                <code>
                    {JSON.stringify({ focusOn, inputValue, value }, null, 2)}
                </code>
            </pre>
        </>
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
