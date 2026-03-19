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

export interface DailyRecord {
  dayOfWeek: string;
  date: string;
  isExist: boolean;
  content: string;
}

export interface KidDashboardResult {
  kidId: number;
  kidName: string;
  analysis: string;
  strengths: string[];
  comprehensiveFeedback: string;
  weeklyRecords: DailyRecord[];
}

export async function getKidDashboard(kidId: number): Promise<ApiResponse<KidDashboardResult>> {
  const { data } = await client.get<ApiResponse<KidDashboardResult>>(`/kids/${kidId}/dashboard`);
  return data;
}

export async function analyzeKid(kidId: number): Promise<ApiResponse<KidDashboardResult>> {
  const { data } = await client.post<ApiResponse<KidDashboardResult>>(`/kids/${kidId}/analyze`);
  return data;
}

export async function createKid(userId: number, data: KidCreateRequest): Promise<ApiResponse<KidCreateResult>> {
  const { data: res } = await client.post<ApiResponse<KidCreateResult>>(`/users/${userId}/kids`, data);
  return res;
}
