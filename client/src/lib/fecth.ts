import { getSession } from "@/utils/session";

export async function api(path: string, init?: RequestInit) {
  const baseUrl = import.meta.env.VITE_API_SERVICE;
  const apiPrefix = "";
  const url = new URL(apiPrefix.concat(path), baseUrl);
  const token = await getSession();

  return fetch(url, {
    ...init,
    headers: {
      ...init?.headers,
      // Authorization: env.NEXT_PUBLIC_API_TOKEN_CLIENT,
      Authorization: token ? `Bearer ${token.token}` : "",
      "Content-Type": "application/json",
    },
  });
}

export async function gettingData<T>(path: string): Promise<T> {
  //colocar o try catch aqui
  const response = await api(path);
  return await response.json();
}

export async function settingData<T>(
  path: string,
  body: BodyInit,
  method: "post" | "put" | "patch" = "post"
): Promise<T> {
  //colocar o try catch aqui
  const response = await api(path, {
    body: body,
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
}

export async function deletingData<T>(
  path: string,
  body?: BodyInit
): Promise<T> {
  const response = await api(path, { method: "delete", body: body });
  return await response.json();
}
