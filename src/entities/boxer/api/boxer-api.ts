import {
  boxerControllerHandleBoxerList,
  useBoxerControllerHandleBoxerList,
} from "@/shared/model/petstore";
import {
  defineTableConfig,
} from "@/shared/model/schemas/configInterface";

type BoxerListResponse = Awaited<
  ReturnType<typeof boxerControllerHandleBoxerList>
>;
type BoxerRow = BoxerListResponse["data"]["data"]["boxers"][number];

type BoxerListParams = {skip?: number, take?:number}

export const boxerConfig = defineTableConfig<BoxerListResponse, BoxerRow, BoxerListParams>({
  entityName: "Боксеры",
  table: {
    useHook: (params) =>
      useBoxerControllerHandleBoxerList(params),
    getRows: (res) => res.data.data.boxers,
    columns: [
      { header: "ID", accessorKey: "boxerId" },
      { header: "Имя боксера", accessorKey: "fullname" },
      { header: "Создан", accessorKey: "createdAt" },
      { header: "Обовлен", accessorKey: "updatedAt" },
    ],
  },
});
