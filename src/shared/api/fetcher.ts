import { API_BASE_URL } from "./base-url";

export const customFetch = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const res = await fetch(`${API_BASE_URL}${url}`, options);

  const body = [204, 205, 304].includes(res.status) ? null : await res.text();
  const data = body ? JSON.parse(body) : {};

  const headers = new Headers(options?.headers);

  headers.set("Authorization", "");

  return {
    data,
    status: res.status,
    headers: res.headers,
  } as T;
};
