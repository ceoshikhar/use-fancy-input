# use-fancy-input

React hook for building fancy input for things like OTP, 2FA Code, etc.

## Demo

<img src="https://raw.githubusercontent.com/ceoshikhar/use-fancy-input/main/use-fancy-input-demo.gif?token=GHSAT0AAAAAABQALMD43YOVJHZCUC2SNOQKYVM35XQ"/>

#### Source code behind the GIF above

```tsx
const FancyInputComponent = (props: UseFancyInputOptions) => {
    const { containerRef, inputs } = useFancyInput(props);

    return (
        <>
            <h3>Unstyled</h3>
            <div ref={containerRef}>
                {inputs.map((input) => {
                    return <input {...input.getInputProps()} />;
                })}
            </div>

            <h3>Styled</h3>
            <StyledContainer ref={containerRef}>
                {inputs.map((input) => {
                    return <StyledInput {...input.getInputProps()} />;
                })}
            </StyledContainer>
        </>
    );
};
```
