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
interface ChatMessageDetail {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatHistoryResult {
  messages: ChatMessageDetail[];
}

// AI 응답
interface ChatResponseDTO {
  response: string;
}

export async function getChatRooms(userId: number): Promise<ApiResponse<ChatSidebarResult>> {
  const { data } = await client.get<ApiResponse<ChatSidebarResult>>('/chat/rooms', { params: { userId } });
  return data;
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
