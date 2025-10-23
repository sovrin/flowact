import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import storybook from "eslint-plugin-storybook";
import globals from "globals";

export default [
    js.configs.recommended,
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        languageOptions: {
            parser: typescriptParser,
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                project: "./tsconfig.json", // Add TypeScript project configuration
            },
        },
        plugins: {
            "@typescript-eslint": typescript,
            react,
            "react-hooks": reactHooks,
            prettier,
            storybook,
        },
        rules: {
            ...typescript.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules, // Uncomment this
            "prettier/prettier": "error", // Add Prettier rule
            ...storybook.configs.recommended.rules,
            ...prettierConfig.rules,

            "react/react-in-jsx-scope": "off",
            // Disable conflicting ESLint rules that TypeScript handles
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "error",
            "no-undef": "off",
            "no-redeclare": "off",
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
];
