import type { UseQueryResult } from "@tanstack/react-query";

export type ConfigHook<TData = unknown> = (
  ...args: any[]
) => UseQueryResult<TData, any>;

export interface ConfigInterface<TData, TRow extends object> {
  entityName: string;
  table: {
    useHook: ConfigHook<TData>;
    columns: { header: string; accessorKey: keyof TRow & string }[];
    getRows: (response: TData) => TRow[];
  };
}

/** Infers TData from the hook and TRow from getRows (avoids keyof never). */
export function defineTableConfig<TData, TRow extends object>(
  config: ConfigInterface<TData, TRow>,
): ConfigInterface<TData, TRow> {
  return config;
}
