import { useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { type ConfigInterface } from '../model/schemas/configInterface';

// Принимаем наш типизированный интерфейс[cite: 2]
export default function DynamicTable<TData, TRow extends object, TParams>({ 
  config 
}: { 
  config: ConfigInterface<TData, TRow, TParams> 
}) {
  // 1. Берем дефолтный take из конфига (или ставим 10)[cite: 2]
  const defaultTake = (config.table.params as any)?.take || 10;
  
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultTake,
  });

  // 2. Вычисляем параметры для бэкенда
  const skip = pagination.pageIndex * pagination.pageSize;
  const take = pagination.pageSize;

  // 3. Собираем итоговые параметры (мержим дефолтные и пагинацию)[cite: 2]
  const queryParams = { ...config.table.params, skip, take } as TParams;

  // 4. Вызываем хук из конфига[cite: 2]
  const { data, isLoading, isError } = config.table.useHook(queryParams);
  
  const rows = data ? config.table.getRows(data) : [];

  const table = useReactTable({
    data: rows,
    columns: config.table.columns,
    getCoreRowModel: getCoreRowModel(),
    state: { pagination },
    onPaginationChange: setPagination,
    manualPagination: true,
  });

  if (isLoading) return <div className="p-4">Загрузка...</div>;
  if (isError) return <div className="p-4 text-destructive">Ошибка загрузки</div>;
  if (!rows.length && pagination.pageIndex === 0) return <div className="p-4">Нет данных</div>;

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b transition-colors hover:bg-muted/50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Страница {table.getState().pagination.pageIndex + 1} / {pagination.pageSize}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Назад
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={rows.length < pagination.pageSize}
          >
            Вперед
          </Button>
        </div>
      </div>
    </div>
  );
}