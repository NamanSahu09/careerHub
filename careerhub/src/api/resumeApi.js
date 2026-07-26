import client from "./client.js";

export const resumeApi = {
  getResume: () => client.get("/resume").then((r) => r.data),
  saveResume: (payload) => client.post("/resume", payload).then((r) => r.data),
  searchResumes: (query) => client.get("/resume/search", { params: { query } }).then((r) => r.data),
};
