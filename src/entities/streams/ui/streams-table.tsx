import DynamicTable from "@/shared/ui/DynamicTable";
import { streamConfig } from "../api/streams-api";

function StreamTable() {
  return <DynamicTable config={streamConfig} />;
}

export default StreamTable;
