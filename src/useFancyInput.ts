import { useEffect, useMemo, useReducer, useRef, useState } from "react";

import { isMacOS } from "./utils";

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
    const focusOnRef = useRef<number | null>(0);

    const containerRef = useRef<TContainerRef | null>(null);

    const rerender = useReducer((x) => x + 1, 0)[1];

    useEffect(() => {
        if (focusOnRef.current === null) return;

        const elements = containerRef.current?.getElementsByTagName("input");
        const inputEl = elements?.[focusOnRef.current];
        inputEl?.focus();
    }, [focusOnRef.current]);

    const createHandleOnChange = (handler?: (event: EventChange) => any) => {
        return (event: EventChange) => {
            handler?.(event);
            event.persist();

            const value = event.target.value;

            // Discard the value if the RegExp test fails for the `pattern`.
            if (pattern && !new RegExp(pattern).test(value)) return;

            const focusOn = focusOnRef.current;
            if (focusOn === null) return;

            setValueArray((prev) => {
                const copy = [...prev];
                copy[focusOn] = value;
                return copy;
            });

            focusOnRef.current = Math.min(length - 1, focusOn + 1);
        };
    };

    const createHandleOnKeyDown = (handler?: (event: EventKeyboard) => any) => {
        return (event: EventKeyboard) => {
            handler?.(event);

            const key = event.key;
            const meta = event.metaKey;
            const ctrl = event.ctrlKey;
            const focusOn = focusOnRef.current;

            if (focusOn === null) return;

            if (key === "Backspace") {
                console.log("focusOn", focusOn);
                if (valueArray[focusOn]) {
                    // Delete the value of the currently focused input.
                    setValueArray((prev) => {
                        const copy = [...prev];
                        copy[focusOn] = "";
                        return copy;
                    });
                } else {
                    focusOnRef.current = Math.max(0, focusOn - 1);
                    rerender();
                }
            } else if (key === "a") {
                // If it's macOS we need `Meta(cmd) + a` otherwise `Ctrl + a`.
                if ((isMacOS() && meta) || (!isMacOS() && ctrl)) {
                    console.log("TODO: implement 'Select All'");
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
            focusOnRef.current = index;
        };
    };

    const createHandleOnBlur = (handler?: (event: EventFocus) => any) => {
        return (event: EventFocus) => {
            handler?.(event);
            focusOnRef.current = null;
        };
    };

    const createHandleOnPaste = (handler?: (event: EventPaste) => any) => {
        return (event: EventPaste) => {
            handler?.(event);

            const focusOn = focusOnRef.current;

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

            focusOnRef.current = Math.min(focusOn + text.length, length - 1);
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
                    onChange: createHandleOnChange(onChangeProp),
                    onFocus: createHandleOnFocus(index, onFocusProp),
                    onKeyDown: createHandleOnKeyDown(onKeyDownProp),
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

    console.log({
        value,
        focusOn: focusOnRef.current,
    });

    return {
        containerRef,
        inputs,
        value,
    };
};

export type { UseFancyInputOptions, UseFancyInputResult };

export { useFancyInput };
