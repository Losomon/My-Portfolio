import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // The particle-field engine files are a verbatim port that rely on @ts-nocheck.
  {
    files: ["components/particle-field/**"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
  // The motion-templates engine is a verbatim port that relies on @ts-nocheck.
  {
    files: ["lib/motion-templates/**"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
