import { useState, useRef, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ChatBot, { type Message } from './ChatBot';
import UploadArea from './UploadArea';
import axios from 'axios';
import { uploadKidsNote } from '../../api/kidsNote';
import { createChatRoom, sendMessage, getChatMessages } from '../../api/chat';
import { authStore } from '../../store/auth';

const todayLabel = (() => {
  const d = new Date();
  return `${d.getMonth() + 1}/${String(d.getDate()).padStart(2, '0')}`;
})();

const Main = () => {
  const { childId } = useParams<{ childId: string }>();
  const location = useLocation();
  const locationState = location.state as { childName?: string; roomId?: number } | null;
  const childName = locationState?.childName ?? '아이';
  const locationRoomId = locationState?.roomId;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [roomId, setRoomId] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 기존 채팅방 메시지 로드
  useEffect(() => {
    if (!locationRoomId) return;
    setRoomId(locationRoomId);
    setLoading(true);
    getChatMessages(locationRoomId)
      .then((data) => {
        const msgs: Message[] = (data.result?.messages ?? []).map((m) => ({
          role: m.sender === 'USER' ? ('user' as const) : ('assistant' as const),
          content: m.content,
        }));
        setMessages(msgs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [locationRoomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const resolveLastAssistant = (content: string) => {
    setMessages((prev) =>
      prev.map((m, i) => (i === prev.length - 1 ? { role: 'assistant' as const, content } : m))
    );
  };

  const handleSend = async () => {
    if (!input.trim() || loading || !roomId) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg, { role: 'assistant', content: '', isLoading: true }]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendMessage(roomId, userMsg.content);
      resolveLastAssistant(res.result.response);
    } catch (e) {
      const msg = axios.isAxiosError(e) ? (e.response?.data?.message ?? e.message) : '오류가 발생했어요.';
      resolveLastAssistant(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!childId || loading) return;
    const userId = authStore.getUserId();
    const imageUrl = URL.createObjectURL(file);
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: '', imageUrl },
      { role: 'assistant', content: '', isLoading: true },
    ]);
    setLoading(true);

    try {
      // 1. 키즈노트 이미지 업로드 → kidsNoteId
      const noteRes = await uploadKidsNote(Number(childId), file);
      if (!noteRes.isSuccess) throw new Error(noteRes.message);

      // 2. 채팅방 생성 → roomId
      const roomRes = await createChatRoom(userId ?? 1, noteRes.result);
      if (!roomRes.isSuccess) throw new Error(roomRes.message);
      const newRoomId = roomRes.result.chatRoomId;
      setRoomId(newRoomId);

      // 3. AI 첫 분석 메시지
      const aiRes = await sendMessage(newRoomId, '키즈노트를 분석해줘');
      resolveLastAssistant(aiRes.result.response);
    } catch (e) {
      const msg = axios.isAxiosError(e) ? (e.response?.data?.message ?? e.message) : '업로드 중 오류가 발생했어요.';
      resolveLastAssistant(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 상단 자녀 이름 + 날짜 */}
      <Box sx={{ px: 3, pt: 2.5, pb: 0.5, pl: 7, display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <Typography variant="subtitle1" fontWeight={700}>{childName}</Typography>
        <Typography variant="caption" color="text.secondary" fontWeight={500}>{todayLabel}</Typography>
      </Box>

      {/* 채팅 영역 */}
      <ChatBot messages={messages} />
      <div ref={bottomRef} />

      {/* 입력 영역 */}
      <UploadArea
        input={input}
        onInputChange={setInput}
        onSend={handleSend}
        onImageUpload={handleImageUpload}
        disabled={loading}
      />
    </Box>
  );
};

export default Main;
