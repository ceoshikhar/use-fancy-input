import { useEffect, useMemo, useRef, useState } from "react";

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

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
type EventChange = React.ChangeEvent<HTMLInputElement>;
type EventKeyboard = React.KeyboardEvent<HTMLInputElement>;
type EventFocus = React.FocusEvent<HTMLInputElement, Element>;
type GetInputPropsOptions = Pick<
    InputProps,
    "onBlur" | "onChange" | "onKeyDown" | "onFocus"
>;
type GetInputProps = InputProps & { key: string };

interface UseFancyInputResult {
    /**
     * Ref for the container element that wraps the `inputs`. This allows us to
     * access the `<input />` elements to do all the "fancy" things.
     */
    containerRef: React.MutableRefObject<any>;
    /**
     * Index of which `<input />` element is currently focused, `null` if none.
     */
    focusOn: null | number;
    /**
     * To render the `<input />` elements. It has the `getInputProps` props
     * getter to build the `<input />` elements correctly.
     */
    inputs: {
        getInputProps: (options?: GetInputPropsOptions) => GetInputProps;
    }[];
    /**
     * String value built combining each of the `<input />` element's value.
     */
    inputValue: string;
    /**
     * Array containing each `<input />` element's value.
     */
    value: string[];
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
    const inputValue = useMemo(() => value.join(""), [value]);
    const [focusOn, setFocusOn] = useState<number | null>(null);
    const containerRef = useRef<any | null>(null);

    const createHandleOnChange = (
        index: number,
        handler?: (event: EventChange) => any
    ) => {
        return (event: EventChange) => {
            handler?.(event);
            event.persist();

            const value = event.target.value;

            if (pattern && !new RegExp(pattern).test(value)) return;

            setValue((prev) => {
                const copy = [...prev];
                copy[index] = value;
                return copy;
            });

            setFocusOn((prev) => {
                if (prev === null) return null;
                return prev === length - 1 ? prev : prev + 1;
            });
        };
    };

    const createHandleOnKeyDown = (
        index: number,
        handler?: (event: EventKeyboard) => any
    ) => {
        return (event: EventKeyboard) => {
            handler?.(event);

            if (event.key === "Backspace") {
                if (value[index]) {
                    setValue((prev) => {
                        const copy = [...prev];
                        copy[index] = "";
                        return copy;
                    });
                } else {
                    setFocusOn((prev) => {
                        if (prev === null) return prev;
                        return prev === 0 ? 0 : prev - 1;
                    });
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
            setFocusOn(index);
        };
    };

    const createHandleOnBlur = (handler?: (event: EventFocus) => any) => {
        return (event: EventFocus) => {
            handler?.(event);
            setFocusOn(null);
        };
    };

    useEffect(() => {
        if (focusOn !== null) {
            const inputEl = containerRef.current?.getElementsByTagName("input")[
                focusOn
            ] as HTMLInputElement;
            inputEl.focus();
        }
    }, [focusOn]);

    const inputs = useMemo(() => {
        return value.map((item, index) => {
            const getInputProps = (
                options: GetInputPropsOptions = {}
            ): GetInputProps => {
                const {
                    onBlur: onBlurProp,
                    onChange: onChangeProp,
                    onKeyDown: onKeyDownProp,
                    onFocus: onFocusProp,
                } = options;

                return {
                    key: `fancy_input_${index}`,
                    maxLength: 1,
                    onBlur: createHandleOnBlur(onBlurProp),
                    onChange: createHandleOnChange(index, onChangeProp),
                    onKeyDown: createHandleOnKeyDown(index, onKeyDownProp),
                    onFocus: createHandleOnFocus(index, onFocusProp),
                    pattern,
                    type: "text",
                    value: item,
                };
            };

            return {
                getInputProps,
            };
        });
    }, [value]);

    return { containerRef, focusOn, inputs, inputValue, value };
};

export type { UseFancyInputOptions, UseFancyInputResult };

export { useFancyInput };
