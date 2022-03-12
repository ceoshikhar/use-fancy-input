import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

export interface FancyInputProps {
    length: number;
}

export const FancyInput = ({ length }: FancyInputProps): JSX.Element => {
    const [value, setValue] = useState<string[]>([]);
    const [focusOn, setFocusOn] = useState(0);

    if (!length) {
        console.error(
            "FancyInput: 'length' prop is required and should be greater than 0"
        );
    }

    const createHandleOnChange = (idx: number) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            e.persist();

            const value = e.target.value.trim();
            if (!value) return;

            setValue((prev) => {
                const copy = [...prev];
                copy[idx] = value;
                return copy;
            });
            setFocusOn((prev) => (prev === length - 1 ? prev : prev + 1));
        };
    };

    const createHandleOnBackspace = (idx: number) => {
        return () => {
            if (value[idx]) {
                setValue((prev) => {
                    const copy = [...prev];
                    copy[idx] = "";
                    return copy;
                });
            } else {
                setFocusOn((prev) => (prev === 0 ? 0 : prev - 1));
            }
        };
    };

    const createHandleOnFocus = (idx: number) => {
        return () => {
            setFocusOn(idx);
        };
    };

    console.log("FancyInput: I'm rendering", {
        value,
        focusOn,
    });

    return (
        <Container>
            {new Array(length).fill(undefined).map((_, idx) => {
                const isActive = idx === focusOn;
                return (
                    <Input
                        key={idx}
                        idx={idx}
                        isActive={isActive}
                        value={value[idx] ?? ""}
                        onChange={createHandleOnChange(idx)}
                        onBackspace={createHandleOnBackspace(idx)}
                        onFocus={createHandleOnFocus(idx)}
                    />
                );
            })}
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    gap: 1rem;
`;

interface InputProps
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        "type" | "maxLength"
    > {
    isActive: boolean;
    idx: number;
    onBackspace: () => void;
}

const Input = ({
    isActive,
    idx,
    onBackspace,
    ...rest
}: InputProps): JSX.Element => {
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
    font-family: inherit;
    font-size: 1rem;
    border: none;
    border-radius: 0.25rem;
    background: #e5e5e5;
    padding: 0.5rem 1rem !important;
    width: 1.5rem;
    text-align: center !important;

    &:focus {
        background: inherit;
    }
`;
