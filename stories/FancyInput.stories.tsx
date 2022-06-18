import React from "react";
import styled from "styled-components";
import { useFancyInput, UseFancyInputOptions } from "../src";

export default {
    title: "Fancy Input",
};

const Template = (props: UseFancyInputOptions) => {
    const { containerRef, inputs } = useFancyInput(props);

    return (
        <StyledContainer ref={containerRef}>
            {inputs.map((input) => {
                return <StyledInput {...input.getInputProps()} />;
            })}
        </StyledContainer>
    );
};

export const AllCharactersAllowed = Template.bind({});
AllCharactersAllowed.args = {
    length: 5,
};

export const OnlyAlphanumeric = Template.bind({});
OnlyAlphanumeric.args = {
    length: 5,
    pattern: "[a-zA-Z0-9_]",
};

export const OnlyAlphabets = Template.bind({});
OnlyAlphabets.args = {
    length: 5,
    pattern: "[a-zA-Z]",
};

export const OnlyNumers = Template.bind({});
OnlyNumers.args = {
    length: 5,
    pattern: "[0-9]",
};

const StyledContainer = styled.div`
    width: 100%;
    display: flex;
    column-gap: 16px;
`;

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
