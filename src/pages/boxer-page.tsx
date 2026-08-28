import { BoxerTable } from "@/entities/boxer"; // Импорт твоей готовой таблицы

export function BoxersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Список боксеров</h1>
      <BoxerTable />
    </div>
  );
}
