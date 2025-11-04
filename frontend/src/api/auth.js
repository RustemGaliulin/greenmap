import client from "./client";

export async function register(email, password) {
  const { data } = await client.post("/auth/register", { email, password });
  return data;
}

export async function login(email, password) {
  const { data } = await client.post("/auth/login", { email, password });
  localStorage.setItem("access_token", data.access_token);
  return data;
}

export async function me() {
  const { data } = await client.get("/auth/me");
  return data;
}

export function logout() {
  localStorage.removeItem("access_token");
}
