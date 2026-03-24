import axios from "axios";
import { Note, FetchNotesResponse } from "../types/note";

const noteApi = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
});

noteApi.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchNotes = async (
  page = 1,
  search = "",
): Promise<FetchNotesResponse> => {
  const { data } = await noteApi.get<FetchNotesResponse>("/notes", {
    params: { page, perPage: 9, search },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await noteApi.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (
  note: Omit<Note, "id" | "createdAt" | "updatedAt">,
): Promise<Note> => {
  const { data } = await noteApi.post<Note>("/notes", note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await noteApi.delete<Note>(`/notes/${id}`);
  return data;
};
