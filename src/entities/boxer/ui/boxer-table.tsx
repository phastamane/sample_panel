import DynamicTable from "@/shared/ui/DynamicTable";
import { boxerConfig } from "../api/boxer-api";

function BoxerTable() {
  return <DynamicTable config={boxerConfig} />;
}

export default BoxerTable;
