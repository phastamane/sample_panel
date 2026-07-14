import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Table from "./widgets/table";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Table />
    </QueryClientProvider>
  </StrictMode>,
);
