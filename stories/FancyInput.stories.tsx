import React from "react";

import { FancyInput, FancyInputProps } from "../src";

export default {
    title: "Fancy Input",
    component: FancyInput,
};

const Template = (args: FancyInputProps) => (
    <div
        style={{
            maxWidth: 360,
            fontFamily:
                "Inter, Roobert, Helvetica Neue, Helvetica, Arial, sans-serif",
        }}
    >
        <FancyInput {...args} />
    </div>
);

export const AllCharactersAllowed = Template.bind({});
AllCharactersAllowed.args = {
    length: 5,
};

export const AlphaNumeric = Template.bind({});
AlphaNumeric.args = {
    length: 5,
    pattern: "^[a-zA-Z0-9_]*$",
};

export const OnlyAlphabets = Template.bind({});
OnlyAlphabets.args = {
    length: 5,
    pattern: "^[a-zA-Z0-9_]*$",
};

export const OnlyNumers = Template.bind({});
OnlyNumers.args = {
    length: 5,
    pattern: "[0-9]",
};
