import {
  boxerControllerHandleBoxerList,
  useBoxerControllerHandleBoxerList,
} from "@/shared/model/petstore";
import {
  defineTableConfig,
  type ConfigHook,
} from "@/shared/model/schemas/configInterface";

type BoxerListResponse = Awaited<
  ReturnType<typeof boxerControllerHandleBoxerList>
>;
type BoxerRow = BoxerListResponse["data"]["data"]["boxers"][number];

const defaultListParams = { skip: 0, take: 10 } as const;

export const boxerConfig = defineTableConfig<BoxerListResponse, BoxerRow>({
  entityName: "Боксеры",
  table: {
    useHook: (() =>
      useBoxerControllerHandleBoxerList(
        defaultListParams,
      )) as ConfigHook<BoxerListResponse>,
    getRows: (res) => res.data.data.boxers,
    columns: [
      { header: "ID", accessorKey: "boxerId" },
      { header: "Имя боксера", accessorKey: "fullname" },
      { header: "Создан", accessorKey: "createdAt" },
      { header: "Обовлен", accessorKey: "updatedAt" },
    ],
  },
});
