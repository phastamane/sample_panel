import { managerControllerHandleManagerAuth } from "@/shared/model/petstore";

type AuthPayload = Parameters<typeof managerControllerHandleManagerAuth>[0];

export const authApi = async (payload: AuthPayload) => {
  const data = await managerControllerHandleManagerAuth(payload);
  const token = data.data.meta.jwt;

  //сохраняем в локал стораддже, поскольку бек не принимает куку
  localStorage.setItem("token", token);
};
