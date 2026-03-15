import client from './client';

interface OnboardingRequest {
  userId: number;
  koreanLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  responseLanguage: 'KOREAN' | 'ENGLISH' | 'CHINESE' | 'JAPANESE' | 'VIETNAMESE';
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
