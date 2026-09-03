import DynamicTable from "@/shared/ui/DynamicTable";
import { roundConfig } from "@/entities/round/api/round-api";

export function RoundPage() {
  return (
    <div className="space-y-4">
      <DynamicTable config={roundConfig} />
    </div>
  );
}
