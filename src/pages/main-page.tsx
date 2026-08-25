import { BoxerTable } from "@/entities/boxer";
import { StreamTable } from "@/entities/streams";
import LoginForm from "@/widgets/login-form/login-form";

function MainPage() {
  return (
    <div className="flex flex-col gap-2">
      <LoginForm />
      <BoxerTable />
      <StreamTable />
    </div>
  );
}

export default MainPage;
