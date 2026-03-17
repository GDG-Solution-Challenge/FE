import client from './client';

interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// 채팅방 목록
interface ChatRoom {
  roomId: number;
  date: string;
}

interface ChildChatGroup {
  childId: number;
  childName: string;
  chatRooms: ChatRoom[];
}

interface ChatSidebarResult {
  childChatGroups: ChildChatGroup[];
}

// 채팅방 생성
interface ChatRoomCreateResult {
  chatRoomId: number;
  createdAt: string;
}

// 채팅 메시지
export interface ChatMessageDetail {
  messageId: number;
  sender: string;
  content: string;
  createdAt: string;
}

interface ChatHistoryResult {
  messages: ChatMessageDetail[];
}

// AI 응답
interface ChatResponseDTO {
  response: string;
}

export async function getChatRooms(userId: number): Promise<ApiResponse<ChatSidebarResult>> {
  const { data } = await client.get<any>('/chat/rooms', { params: { userId } });
  // {result: {childChatGroups}} 또는 {childChatGroups} 두 형태 모두 처리
  const groups: ChildChatGroup[] = data?.result?.childChatGroups ?? data?.childChatGroups ?? [];
  return { isSuccess: data?.isSuccess ?? true, code: data?.code ?? '', message: data?.message ?? '', result: { childChatGroups: groups } };
}

export async function createChatRoom(userId: number, kidsNoteId: number): Promise<ApiResponse<ChatRoomCreateResult>> {
  const { data } = await client.post<ApiResponse<ChatRoomCreateResult>>('/chat/rooms', { userId, kidsNoteId });
  return data;
}

export async function getChatMessages(roomId: number): Promise<ApiResponse<ChatHistoryResult>> {
  const { data } = await client.get<ApiResponse<ChatHistoryResult>>(`/chat/rooms/${roomId}/messages`);
  return data;
}

export async function sendMessage(roomId: number, message: string): Promise<ApiResponse<ChatResponseDTO>> {
  const { data } = await client.post<ApiResponse<ChatResponseDTO>>(`/chat/rooms/${roomId}/messages`, { message });
  return data;
}
