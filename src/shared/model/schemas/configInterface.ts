import { type UseQueryResult } from "@tanstack/react-query";

export type ConfigHook<TData, TParams = void> = TParams extends void
  ? () => UseQueryResult<TData | undefined>
  : (params: TParams) => UseQueryResult<TData | undefined, Error | null>;

export interface ConfigInterface<TData, TRow extends object, TParams = void> {
  entityName: string;
  table: {
    useHook: ConfigHook<TData, TParams>;
    params?: TParams;
    columns: { header: string; accessorKey: keyof TRow & string }[];
    getRows: (response: TData) => TRow[];
  };
}

/** Infers TData from the hook and TRow from getRows (avoids keyof never). */
export function defineTableConfig<TData, TRow extends object, TParams = void>(
  config: ConfigInterface<TData, TRow, TParams>,
): ConfigInterface<TData, TRow, TParams> {
  return config;
}
