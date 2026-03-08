import client from './client';

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export async function uploadKidsNote(kidId: number, image: File): Promise<ApiResponse<number>> {
  const formData = new FormData();
  formData.append('image', image);

  const { data } = await client.post<ApiResponse<number>>(`/kidsnotes?kidId=${kidId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
}
