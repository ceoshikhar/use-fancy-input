import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

export interface FancyInputProps {
    length: number;
    pattern?: string;
}

export const FancyInput = ({
    length,
    pattern = "",
}: FancyInputProps): JSX.Element => {
    const [value, setValue] = useState<string[]>([]);
    const [focusOn, setFocusOn] = useState(0);

    if (length < 1) {
        console.error(
            "FancyInput: 'length' prop is required and should be greater than 0"
        );
    }

    const createHandleOnChange = (index: number) => {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            event.persist();

            const value = event.target.value.trim();

            if (!value) return;
            if (!new RegExp(pattern).test(value)) return;

            setValue((prev) => {
                const copy = [...prev];
                copy[index] = value;
                return copy;
            });
            setFocusOn((prev) => (prev === length - 1 ? prev : prev + 1));
        };
    };

    const createHandleOnBackspace = (index: number) => {
        return () => {
            if (value[index]) {
                setValue((prev) => {
                    const copy = [...prev];
                    copy[index] = "";
                    return copy;
                });
            } else {
                setFocusOn((prev) => (prev === 0 ? 0 : prev - 1));
            }
        };
    };

    const createHandleOnFocus = (index: number) => {
        return () => {
            setFocusOn(index);
        };
    };

    console.log("FancyInput: I'm rendering", {
        value,
        focusOn,
    });

    return (
        <Container>
            {length > 0 &&
                // I don't know if there is a better way to render "length"
                // number of `Input` elements?
                new Array(length).fill(undefined).map((_, index) => {
                    return (
                        <Input
                            key={index}
                            isActive={index === focusOn}
                            value={value[index] ?? ""}
                            onChange={createHandleOnChange(index)}
                            onBackspace={createHandleOnBackspace(index)}
                            onFocus={createHandleOnFocus(index)}
                        />
                    );
                })}
        </Container>
    );
};

const Container = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`;

interface InputProps
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        "type" | "maxLength"
    > {
    isActive: boolean;
    onBackspace: () => void;
}

const Input = ({ isActive, onBackspace, ...rest }: InputProps): JSX.Element => {
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        isActive ? ref.current?.focus() : ref.current?.blur();
    }, [isActive]);

    const handleOnKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Backspace") {
            onBackspace();
        }
    };

    return (
        <StyledInput
            {...rest}
            ref={ref}
            type="text"
            maxLength={1}
            onKeyDown={handleOnKeyDown}
        />
    );
};

const StyledInput = styled.input`
    background: #e5e5e5;
    width: 3.5rem;
    padding: 0.5rem 1rem !important;
    font-size: 1rem;
    text-align: center !important;
    border-radius: 0.25rem;
    border: 2px solid transparent;
    box-sizing: border-box;
    outline: none;

    transition: border 175ms ease-out, background-color 175ms ease-out;

    &:hover {
        border: 2px solid #cccccc;
    }

    &:focus {
        background: inherit;
        border: 2px solid #3498db;
    }
`;
