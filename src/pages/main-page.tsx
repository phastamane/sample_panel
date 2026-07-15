import { BoxerTable } from "@/entities/boxer";
import { StreamTable } from "@/entities/streams";

function MainPage() {
  return (
    <div>
      <BoxerTable />
      <StreamTable />
    </div>
  );
}

export default MainPage;
