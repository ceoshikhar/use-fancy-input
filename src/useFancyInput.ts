import { useEffect, useMemo, useReducer, useRef, useState } from "react";

interface UseFancyInputOptions {
    /**
     * The length of the value that this input expects to receive.
     *
     * @example 5 -> If you expect the user to enter a value of 5 characters.
     * Eg: 5 characters long OTP/2FA like "12345" or "e2T;@".
     */
    length: number;

    /**
     * A regular expression pattern to test against every character user enters
     * in the input. If the test fails, the value will be ignored otherwise
     * accepted.
     *
     * @example "[a-zA-Z]" -> This pattern allows only alphabets to be accepted.
     */
    pattern?: string;
}

interface UseFancyInputResult {
    /**
     * Ref for the container element that wraps the `inputs`. This allows us to
     * access the `<input />` elements to do all the "fancy" things.
     */
    containerRef: React.MutableRefObject<any>;
    /**
     * To render the `<input />` elements. It has the `getInputProps` props
     * getter to build the `<input />` elements correctly.
     */
    inputs: {
        getInputProps: (options?: GetInputPropsOptions) => GetInputPropsResult;
    }[];
    /**
     * String value built combining each of the `<input />` element's value.
     */
    value: string;
}

type EventChange = React.ChangeEvent<HTMLInputElement>;
type EventFocus = React.FocusEvent<HTMLInputElement, Element>;
type EventKeyboard = React.KeyboardEvent<HTMLInputElement>;
type EventPaste = React.ClipboardEvent<HTMLInputElement>;

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type GetInputPropsOptions = Pick<
    InputProps,
    "onBlur" | "onChange" | "onFocus" | "onKeyDown" | "onPaste"
>;
type GetInputPropsResult = InputProps & { key: string };

const useFancyInput = <TContainerRef extends HTMLElement = HTMLElement>({
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

    const [valueArray, setValueArray] = useState<string[]>(
        new Array(length).fill("")
    );
    const value = useMemo(() => valueArray.join(""), [valueArray]);

    /**
     * Index of which `<input />` element is currently focused, `null` if none.
     */
    const focusRef = useRef<number | null>(0);

    const containerRef = useRef<TContainerRef | null>(null);

    const rerender = useReducer((x) => x + 1, 0)[1];

    useEffect(() => {
        if (focusRef.current === null) return;

        const elements = containerRef.current?.getElementsByTagName("input");
        const inputEl = elements?.[focusRef.current];
        inputEl?.focus();
    }, [focusRef.current]);

    const createHandleOnChange = (
        index: number,
        handler?: (event: EventChange) => any
    ) => {
        return (event: EventChange) => {
            handler?.(event);
            event.persist();

            const value = event.target.value;

            if (pattern && !new RegExp(pattern).test(value)) return;

            setValueArray((prev) => {
                const copy = [...prev];
                copy[index] = value;
                return copy;
            });

            const prev = focusRef.current;
            if (prev !== null) {
                focusRef.current = prev === length - 1 ? prev : prev + 1;
            }
        };
    };

    const createHandleOnKeyDown = (
        index: number,
        handler?: (event: EventKeyboard) => any
    ) => {
        return (event: EventKeyboard) => {
            handler?.(event);

            if (event.key === "Backspace") {
                if (valueArray[index]) {
                    setValueArray((prev) => {
                        const copy = [...prev];
                        copy[index] = "";
                        return copy;
                    });
                } else {
                    const prev = focusRef.current;
                    if (prev !== null) {
                        if (prev !== 0) {
                            focusRef.current = prev - 1;
                            rerender();
                        }
                    }
                }
            }
        };
    };

    const createHandleOnFocus = (
        index: number,
        handler?: (event: EventFocus) => any
    ) => {
        return (event: EventFocus) => {
            handler?.(event);
            focusRef.current = index;
        };
    };

    const createHandleOnBlur = (handler?: (event: EventFocus) => any) => {
        return (event: EventFocus) => {
            handler?.(event);
            focusRef.current = null;
        };
    };

    const createHandleOnPaste = (handler?: (event: EventPaste) => any) => {
        return (event: EventPaste) => {
            handler?.(event);

            // const focusOn = focusOnRef.current;
            const focusOn = focusRef.current;

            // Can't paste if no `<input />` is focused.
            if (focusOn === null) return;

            const text = event.clipboardData.getData("text");

            setValueArray((prev) => {
                const newValue = Array.from(prev);

                for (
                    let i = 0, f = focusOn;
                    i < text.length, f < length;
                    i += 1, f += 1
                ) {
                    if (text[i] === undefined) break;
                    newValue[f] = text[i];
                }

                return newValue;
            });

            const prev = focusRef.current;
            if (prev !== null) {
                focusRef.current = Math.min(prev + text.length, length - 1);
            }
        };
    };

    const inputs = useMemo(() => {
        return valueArray.map((item, index) => {
            const getInputProps = (
                options: GetInputPropsOptions = {}
            ): GetInputPropsResult => {
                const {
                    onBlur: onBlurProp,
                    onChange: onChangeProp,
                    onFocus: onFocusProp,
                    onKeyDown: onKeyDownProp,
                    onPaste: onPasteProp,
                } = options;

                return {
                    key: `fancy_input_${index}`,
                    maxLength: 1,
                    onBlur: createHandleOnBlur(onBlurProp),
                    onChange: createHandleOnChange(index, onChangeProp),
                    onFocus: createHandleOnFocus(index, onFocusProp),
                    onKeyDown: createHandleOnKeyDown(index, onKeyDownProp),
                    onPaste: createHandleOnPaste(onPasteProp),
                    pattern,
                    type: "text",
                    value: item,
                };
            };

            return {
                getInputProps,
            };
        });
    }, [valueArray]);

    return {
        containerRef,
        inputs,
        value,
    };
};

export type { UseFancyInputOptions, UseFancyInputResult };

export { useFancyInput };
