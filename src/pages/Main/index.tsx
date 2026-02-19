import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ChatBot, { type Message } from './ChatBot';
import UploadArea from './UploadArea';

// TODO: 실제 데이터로 교체
const mockTodo = '내일 준비물: 물감, 앞치마, 개인 컵';

const Main = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg, { role: 'assistant', content: '', isLoading: true }]);
    setInput('');
    setLoading(true);

    // TODO: 실제 API 연동
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1 ? { role: 'assistant', content: '안녕하세요! 키즈노트 내용을 분석해드릴게요.' } : m
        )
      );
      setLoading(false);
    }, 1500);
  };

  const handleImageUpload = (_file: File) => {
    // TODO: 실제 이미지 업로드 처리
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: '[사진 업로드됨]' },
      { role: 'assistant', content: '', isLoading: true },
    ]);
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1 ? { role: 'assistant', content: '사진을 분석했어요. 내일 준비물은 물감, 앞치마입니다.' } : m
        )
      );
      setLoading(false);
    }, 1500);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 상단 TODO 요약 */}
      <Paper
        elevation={0}
        sx={{
          mx: 2,
          mt: 2,
          mb: 1,
          px: 2,
          py: 1.5,
          borderRadius: 2.5,
          backgroundColor: '#FFF8E7',
          border: '1px solid #F2B50B33',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 1,
        }}
      >
        <NotificationsActiveIcon sx={{ fontSize: 18, color: '#F2B50B', mt: 0.2, flexShrink: 0 }} />
        <Typography variant="caption" sx={{ lineHeight: 1.6, fontWeight: 500 }}>
          {mockTodo}
        </Typography>
      </Paper>

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
