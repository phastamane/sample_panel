import DynamicTable from "@/shared/ui/DynamicTable";
import { matchConfig } from "../api/match-api";

function MatchTable() {
  return <DynamicTable config={matchConfig} />;
}

export default MatchTable;
