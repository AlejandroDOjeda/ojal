import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Todo el proyecto sigue el patrón "fetch de datos al montar el
      // componente" (containers con useEffect(() => { fetchX() }, [fetchX])).
      // Es intencional y no es un bug; bajar a warning para no bloquear CI
      // por un patrón usado en 16+ archivos. Revisar si se migra a una
      // librería de data fetching (React Query/SWR) más adelante.
      "react-hooks/set-state-in-effect": "warn",
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
