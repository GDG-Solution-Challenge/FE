import client from './client';

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

interface KidCreateRequest {
  name: string;
  gender: 'MALE' | 'FEMALE';
  birthDate: string; // "YYYY-MM-DD"
}

interface KidCreateResult {
  kidId: number;
  createdAt: string;
}

export async function createKid(userId: number, data: KidCreateRequest): Promise<ApiResponse<KidCreateResult>> {
  const { data: res } = await client.post<ApiResponse<KidCreateResult>>(`/users/${userId}/kids`, data);
  return res;
}
