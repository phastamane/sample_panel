import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ConfigInterface } from "../model/schemas/configInterface";
import { Spinner } from "@/components/ui/spinner";

function DynamicTable<TData, TRow extends object>({
  config,
}: {
  config: ConfigInterface<TData, TRow>;
}) {
  const { data, isLoading, isError } = config.table.useHook();

  const rows = data ? config.table.getRows(data) : [];

  const table = useReactTable({
    data: rows,
    columns: config.table.columns.map((col) => ({
      header: col.header,
      accessorKey: col.accessorKey,
    })),
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
  if (isError) {
    return <div>Произошла ошибка{isError.valueOf()}</div>;
  }

  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm m-2">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {table.getRowModel().rows.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          Нет данных для отображения
        </div>
      )}
    </div>
  );
}

export default DynamicTable;
