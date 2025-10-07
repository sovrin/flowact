import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
    core: {
        disableTelemetry: true,
    },
    stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: ["@storybook/addon-vitest", "@storybook/addon-docs"],
    framework: {
        name: "@storybook/react-vite",
        options: {
            strictMode: true,
        },
    },
};

export default config;
