import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ConfigInterface } from "../model/schemas/configInterface";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

function DynamicTable<TData, TRow extends object>({
  config,
}: {
  config: ConfigInterface<TData, TRow>;
}) {
  const { data, isLoading, isError } = config.table.useHook();

  const rows = data ? (config.table.getRows(data) ?? []) : [];

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
    <Table>
      <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
      </TableHeader>

      <TableBody>
        {table.getRowModel().rows.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={config.table.columns.length}
              className="h-24 text-center text-muted-foreground"
            >
              Нет данных для отображения
            </TableCell>
          </TableRow>
        ) : (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export default DynamicTable;
