import { BoxerTable } from "@/entities/boxer";
import { StreamTable } from "@/entities/streams";

function MainPage() {
  return (
    <div className="flex flex-col gap-2">
      <BoxerTable />
      <StreamTable />
    </div>
  );
}

export default MainPage;
