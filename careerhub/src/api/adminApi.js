import client from "./client.js";

export const adminApi = {
  stats: () => client.get("/admin/stats").then((r) => r.data),
  jobs: (params) => client.get("/admin/jobs", { params }).then((r) => r.data),
  updateJobStatus: (id, status) => client.patch(`/admin/jobs/${id}/status`, { status }).then((r) => r.data),
  candidates: () => client.get("/admin/candidates").then((r) => r.data),
  employers: () => client.get("/admin/employers").then((r) => r.data),
  setUserActive: (id, isActive) => client.patch(`/admin/users/${id}/active`, { isActive }).then((r) => r.data),
};
