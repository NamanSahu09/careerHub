import client from "./client.js";

export const authApi = {
  registerCandidate: (payload) => client.post("/auth/register/candidate", payload).then((r) => r.data),
  registerEmployer: (payload) => client.post("/auth/register/employer", payload).then((r) => r.data),
  login: (payload) => client.post("/auth/login", payload).then((r) => r.data),
  logout: () => client.post("/auth/logout").then((r) => r.data),
  me: () => client.get("/auth/me").then((r) => r.data),
};
