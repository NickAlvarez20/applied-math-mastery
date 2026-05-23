import client from "./client";
import type { Subject, Topic } from "@/types/subject.types";
import type { APIResponse } from "@/types/api.types";

export const subjectsAPI = {
  list: () => client.get<APIResponse<Subject[]>>("/api/v1/subjects"),

  getById: (id: string) =>
    client.get<APIResponse<Subject>>(`/api/v1/subjects/${id}`),

  getTopics: (subjectId: string) =>
    client.get<APIResponse<Topic[]>>(`/api/v1/subjects/${subjectId}/topics`),

  getTopic: (topicId: string) =>
    client.get<APIResponse<Topic>>(`/api/v1/subjects/topics/${topicId}`),
};
