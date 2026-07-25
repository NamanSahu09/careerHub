import client from "./client";

export const startInterview = (role, difficulty) =>
  client.post("/interview/start", { role, difficulty });

export const evaluateAnswer = (sessionId, questionIndex, answer) =>
  client.post("/interview/evaluate", { sessionId, questionIndex, answer });

export const completeInterview = (sessionId) =>
  client.post("/interview/complete", { sessionId });

export const getInterviewHistory = () =>
  client.get("/interview/history");
