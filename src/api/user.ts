import client from './client';

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

interface OnboardingRequest {
  userId: number;
  koreanLevel: 'HIGH' | 'MID' | 'LOW';
  responseLanguage: 'KOREAN' | 'NATIVE' | 'BOTH';
}

interface User {
  id: number;
  name: string;
  email: string;
  koreanLevel: string;
  responseLanguage: string;
  createdAt: string;
  updatedAt: string;
}

export async function patchOnboarding(data: OnboardingRequest): Promise<User> {
  const { data: res } = await client.patch<User>('/users/onboarding', data);
  return res;
}

export async function getUser(userId: number): Promise<User> {
  const { data: res } = await client.get<User>(`/users/${userId}`);
  return res;
}
