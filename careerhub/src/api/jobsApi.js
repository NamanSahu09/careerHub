import client from "./client.js";

export const jobsApi = {
  list: (params) => client.get("/jobs", { params }).then((r) => r.data),
  detail: (id) => client.get(`/jobs/${id}`).then((r) => r.data),
  create: (payload) => client.post("/jobs", payload).then((r) => r.data),
  mine: () => client.get("/jobs/mine").then((r) => r.data),
  update: (id, payload) => client.patch(`/jobs/${id}`, payload).then((r) => r.data),
  remove: (id) => client.delete(`/jobs/${id}`).then((r) => r.data),
};
