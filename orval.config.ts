import { defineConfig } from "orval";

export default defineConfig({
  petstore: {
    output: {
      mode: "single",
      target: "./src/shared/model/petstore.ts",
      schemas: { path: "./src/shared/model/schemas", type: "zod" },
      client: "react-query",
      mock: true,
      formatter: "prettier",
      override: {
        mutator: {
          path: "./src/shared/api/fetcher.ts",
          name: "customFetch",
        },

        query: {
          useQuery: true,
          useMutation: false,
          useSuspenseQuery: true,
          useSuspenseInfiniteQuery: true,
          useInfinite: true,
          useInfiniteQueryParam: "skip",
          useInvalidate: true,
        },
      },
    },
    input: {
      target:
        "https://api.manager.development.clp.cyberboxing.ru/documentation-json",
    },
  },
});
