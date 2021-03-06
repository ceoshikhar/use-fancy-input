module.exports = {
    stories: [
        "../stories/**/*.stories.mdx",
        "../stories/**/*.stories.@(js|jsx|ts|tsx)",
    ],
    addons: [
        "@storybook/addon-links",
        {
            name: "@storybook/addon-essentials",
            options: {
                docs: false,
            },
        },
        "@storybook/addon-interactions",
        "storybook-addon-styled-component-theme/dist/preset",
    ],
    framework: "@storybook/react",
    core: {
        builder: "webpack5",
    },
};
