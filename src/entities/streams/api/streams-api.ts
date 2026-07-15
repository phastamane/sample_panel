import {
  streamControllerHandleStreamList,
  useStreamControllerHandleStreamList,
} from "@/shared/model/petstore";
import { defineTableConfig } from "@/shared/model/schemas/configInterface";

type StreamListResponse = Awaited<
  ReturnType<typeof streamControllerHandleStreamList>
>;
type StreamRow = StreamListResponse["data"]["data"]["streams"][number];

export const streamConfig = defineTableConfig<StreamListResponse, StreamRow>({
  entityName: "Стримы",
  table: {
    useHook: useStreamControllerHandleStreamList,
    getRows: (res) => res.data.data.streams,
    columns: [
      { header: "ID", accessorKey: "streamId" },
      { header: "Название", accessorKey: "title" },
      { header: "Создан", accessorKey: "createdAt" },
      { header: "Обовлен", accessorKey: "updatedAt" },
    ],
  },
});
