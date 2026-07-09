import { defineConfig } from "orval";

const API_URL = process.env.ORVAL_API_URL ?? "http://192.168.0.101:3000/openapi.json";

export default defineConfig({
  api: {
    // input: "http://192.168.0.101:3000/openapi.json",
    input: API_URL,
    output: {
      mode: "tags-split",
      target: "src/api/generated",
      schemas: "src/api/generated/models",
      client: "react-query",
      httpClient: "fetch",
      clean: true,
      override: {
        mutator: { path: "src/api/fetcher.ts", name: "customFetch" },
        fetch: {
          includeHttpResponseReturnType: false, 
        },
      },
    },
  },
});
