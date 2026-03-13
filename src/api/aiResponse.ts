import client from './client';

export interface AiResponse {
  summary: string;
  todoList: string;
  guide: string;
}

export async function getAiResponse(kidsNoteId: number): Promise<AiResponse> {
  const { data } = await client.post<AiResponse>(`/ai-response/${kidsNoteId}`);
  return data;
}
