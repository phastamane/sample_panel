import {
  useBoxerControllerHandleBoxerList,
  type boxerControllerHandleBoxerList,
} from "@/shared/model/petstore";
import { defineTableConfig } from "@/shared/model/schemas/configInterface";

type BoxerListResponse = Awaited<
  ReturnType<typeof boxerControllerHandleBoxerList>
>;
type BoxerRow = BoxerListResponse["data"]["data"]["boxers"][number];

export const boxerConfig = defineTableConfig<BoxerListResponse, BoxerRow>({
  entityName: "Боксеры",
  table: {
    useHook: useBoxerControllerHandleBoxerList,
    getRows: (res) => res.data.data.boxers,
    columns: [
      { header: "ID", accessorKey: "boxerId" },
      { header: "Имя боксера", accessorKey: "fullname" },
      { header: "Создан", accessorKey: "createdAt" },
      { header: "Обовлен", accessorKey: "updatedAt" },
    ],
  },
});
