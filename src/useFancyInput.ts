import { useEffect, useMemo, useRef, useState } from "react";

interface UseFancyInputOptions {
    /**
     * @description The length of the value that this input expects to receive.
     *
     * @example 5 -> If you expect the user to enter a value of 5 characters.
     * Eg: 5 characters long OTP/2FA like "12345" or "e2T;@".
     */
    length: number;

    /**
     * @description A regex pattern to test against every character user enters
     * in the input. If the test fails, the value will be ignored otherwise
     * accepted.
     *
     * @example "[a-zA-Z]" -> This pattern allows only alphabets to be accepted.
     */
    pattern?: string;
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type EventOnChange = React.ChangeEvent<HTMLInputElement>;
type EventOnKeyDown = React.KeyboardEvent<HTMLInputElement>;
type EventOnFocus = React.FocusEvent<HTMLInputElement, Element>;
type CustomInputProps = Omit<InputProps, "type" | "maxLength">;
type GetInputProps = InputProps & { key: string };

interface UseFancyInputResult {
    containerRef: React.MutableRefObject<any>;
    inputs: { getInputProps: (props?: CustomInputProps) => GetInputProps }[];
    value: string;
}

const useFancyInput = ({
    length,
    pattern,
}: UseFancyInputOptions): UseFancyInputResult => {
    if (!length || length <= 0) {
        throw new Error(
            "useFancyInput: 'length' is required and should be greater than 0" +
                " but received " +
                length
        );
    }

    const [value, setValue] = useState<string[]>(new Array(length).fill(""));
    const [focusOn, setFocusOn] = useState(0);
    const containerRef = useRef<any | null>(null);

    const createHandleOnChange = (
        index: number,
        handler?: (event: EventOnChange) => any
    ) => {
        return (event: EventOnChange) => {
            handler?.(event);
            event.persist();

            const value = event.target.value;

            if (pattern && !new RegExp(pattern).test(value)) return;

            setValue((prev) => {
                const copy = [...prev];
                copy[index] = value;
                return copy;
            });

            setFocusOn((prev) => (prev === length - 1 ? prev : prev + 1));
        };
    };

    const createHandleOnKeyDown = (
        index: number,
        handler?: (event: EventOnKeyDown) => any
    ) => {
        return (event: EventOnKeyDown) => {
            handler?.(event);

            if (event.key !== "Backspace") {
                return;
            }

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

    const createHandleOnFocus = (
        index: number,
        handler?: (event: EventOnFocus) => any
    ) => {
        return (event: EventOnFocus) => {
            handler?.(event);
            setFocusOn(index);
        };
    };

    useEffect(() => {
        const inputEl = containerRef.current?.childNodes[
            focusOn
        ] as HTMLInputElement;
        inputEl.focus();
    }, [focusOn]);

    const inputs = useMemo(() => {
        return value.map((v, index) => {
            const getInputProps = (
                props: CustomInputProps = {}
            ): GetInputProps => {
                const {
                    onChange: onChangeProp,
                    onKeyDown: onKeyDownProp,
                    onFocus: onFocusProp,
                    ...rest
                } = props;

                return {
                    key: String(index),
                    type: "text",
                    maxLength: 1,
                    value: v,
                    onChange: createHandleOnChange(index, onChangeProp),
                    onKeyDown: createHandleOnKeyDown(index, onKeyDownProp),
                    onFocus: createHandleOnFocus(index, onFocusProp),
                    ...rest,
                };
            };

            return {
                getInputProps,
            };
        });
    }, [value]);

    return { containerRef, inputs, value: value.join("") };
};

export type { UseFancyInputOptions, UseFancyInputResult };

export { useFancyInput };
