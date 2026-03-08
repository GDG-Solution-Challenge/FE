import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ChatBot, { type Message } from './ChatBot';
import UploadArea from './UploadArea';
import imgAlimjang from '../../assets/image.png';
import axios from 'axios';
import { uploadKidsNote } from '../../api/kidsNote';

// TODO: 실제 데이터로 교체
const mockChildMap: Record<string, string> = {
  '1': '김민준',
  '2': '김서아',
};
const mockTodo = '낮잠 1시간 미만 · 오늘 저녁 일찍 재워주세요';

const mock223Messages: Message[] = [
  {
    role: 'user',
    content: '',
    imageUrl: imgAlimjang,
  },
  {
    role: 'assistant',
    content: `## 🎭 오늘의 활동 요약

아이스크림 가게 역할놀이를 했어요. 맡은 역할에 집중하며 직접 만든 아이스크림을 선생님께 드리고 *"선생님도 드세요~"* 라고 말하는 배려 있는 모습을 보여줬어요.

---

## 😴 낮잠

오늘 낮잠은 **1시간 미만**이었어요. 평소보다 짧아 저녁에 피곤해할 수 있으니 컨디션을 살펴봐 주세요.

---

## 💡 오늘의 육아 가이드

역할놀이에서 자발적인 나눔과 배려가 나타났어요. 이 시기엔 **구체적인 상황 속에서** 예절을 반복 경험하는 게 효과적이에요.

> "선생님도 드세요~" 했던 것처럼, 오늘 저녁 식사 자리에서 할머니·할아버지께 먼저 드려보는 연습을 해보세요.

---

## ✅ 오늘의 체크리스트

- [ ] 저녁 식사 시 "할머니/할아버지 먼저 드세요" 연습하기
- [ ] 내일 등원 시 유치원 차 기사님께 배꼽인사하며 "안녕하세요" 하고, 안전벨트 매주시면 "감사합니다" 하기
- [ ] 낮잠이 짧았으니 평소보다 30분 일찍 재우기
- [ ] 오늘 역할놀이 이야기 나눠보기 ("오늘 어떤 아이스크림 팔았어?")`,
  },
];

const todayLabel = (() => {
  const d = new Date();
  return `${d.getMonth() + 1}/${String(d.getDate()).padStart(2, '0')}`;
})();

const Main = () => {
  const { childId } = useParams<{ childId: string }>();
  const childName = childId ? (mockChildMap[childId] ?? '아이') : '아이';
  const [messages, setMessages] = useState<Message[]>(() =>
    childId === '1' ? mock223Messages : []
  );
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

  const handleImageUpload = async (file: File) => {
    if (!childId || loading) return;
    const imageUrl = URL.createObjectURL(file);
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: '', imageUrl },
      { role: 'assistant', content: '', isLoading: true },
    ]);
    setLoading(true);

    try {
      const res = await uploadKidsNote(Number(childId), file);
      if (!res.isSuccess) throw new Error(res.message);
      // TODO: noteId(res.result)로 분석 결과 조회 API 연동
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1 ? { role: 'assistant', content: res.message } : m
        )
      );
    } catch (e) {
      const msg = axios.isAxiosError(e) ? (e.response?.data?.message ?? e.message) : '업로드 중 오류가 발생했어요.';
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1 ? { role: 'assistant', content: msg } : m
        )
      );
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
