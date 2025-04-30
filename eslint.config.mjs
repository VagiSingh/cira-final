import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Extending the base ESLint configurations
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Add custom rules here
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'off', // Disable the unused-vars rule
      'no-var': 'off', // Disable the 'no-var' rule if you don't want to enforce `let/const`
      "@typescript-eslint/no-require-imports": "off"
    },
  },
];

export default eslintConfig;
