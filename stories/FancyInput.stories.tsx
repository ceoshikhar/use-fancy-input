import React from "react";

import { FancyInput, FancyInputProps } from "../src/index";

export default {
    title: "Fancy Input",
    component: FancyInput,
};

const Template = (args: FancyInputProps) => <FancyInput {...args} />;

export const Simple = Template.bind({});
Simple.args = {
    length: 5,
};
