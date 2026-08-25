import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/entities/auth/auth-api";
import { useState, type ChangeEvent, type SubmitEvent } from "react";

function LoginForm() {
  const [form, setForm] = useState({
    data: { manager: { username: "", password: "" } },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      data: {
        manager: { ...prev.data.manager, [name]: value },
      },
    }));
  };

  const handleSumbit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await authApi(form);
  };
  return (
    <div className="flex flex-col gap-2">
      <form
        className="flex flex-col gap-2 max-w-lg mx-auto"
        onSubmit={handleSumbit}
      >
        <Input
          name="username"
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <Input
          name="password"
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <Button className={"cursor-pointer"} type={"submit"}>
          submit
        </Button>
      </form>
    </div>
  );
}

export default LoginForm;
