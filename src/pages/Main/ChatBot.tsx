import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PushPinIcon from '@mui/icons-material/PushPin';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Spinner from '../../components/common/Spinner';
import imgAlimjang from '../../assets/image copy.png';
import imgGongji from '../../assets/image copy 3.png';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  isLoading?: boolean;
}

interface Props {
  messages: Message[];
}

const mdCardSx = {
  backgroundColor: '#fff',
  border: '1px solid #E8E8E8',
  borderRadius: 3,
  px: 2.5,
  py: 2,
  '& h2': { fontSize: '0.9rem', fontWeight: 700, mt: 2, mb: 0.75, color: '#111', '&:first-of-type': { mt: 0 } },
  '& h3': { fontSize: '0.82rem', fontWeight: 600, mt: 1.5, mb: 0.5, color: '#333' },
  '& p': { fontSize: '0.82rem', lineHeight: 1.75, color: '#333', mt: 0, mb: 1 },
  '& ul, & ol': { pl: 2.5, mb: 1, mt: 0 },
  '& li': { fontSize: '0.82rem', lineHeight: 1.75, color: '#333', mb: 0.25 },
  '& li input[type="checkbox"]': { mr: 0.75, accentColor: '#25671E' },
  '& blockquote': {
    m: 0, mb: 1, pl: 1.5,
    borderLeft: '3px solid #25671E',
    backgroundColor: '#F0F7EE',
    borderRadius: '0 8px 8px 0',
    py: 0.75,
    '& p': { mb: 0, color: '#25671E', fontWeight: 500 },
  },
  '& hr': { border: 'none', borderTop: '1px solid #F0F0F0', my: 1.5 },
  '& strong': { fontWeight: 700, color: '#111' },
  '& em': { color: '#555' },
};

// 유저 메시지: 말풍선
const UserBubble = ({ message }: { message: Message }) => (
  <Box sx={{ display: 'flex', flexDirection: 'row-reverse', alignItems: 'flex-end', gap: 1, mb: 2 }}>
    <Avatar sx={{ width: 28, height: 28, backgroundColor: 'secondary.main', flexShrink: 0 }}>
      <PersonIcon sx={{ fontSize: 16 }} />
    </Avatar>
    <Box sx={{ maxWidth: '72%', borderRadius: '16px 4px 16px 16px', overflow: 'hidden', backgroundColor: 'primary.main', color: '#fff' }}>
      {message.imageUrl && (
        <Box component="img" src={message.imageUrl} alt="업로드 이미지" sx={{ width: '100%', maxWidth: 220, display: 'block', objectFit: 'cover' }} />
      )}
      {message.content && (
        <Box sx={{ px: 2, py: 1.25 }}>
          <Typography variant="body2" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {message.content}
          </Typography>
        </Box>
      )}
    </Box>
  </Box>
);

// 어시스턴트 메시지: Notion 카드
const AssistantCard = ({ message }: { message: Message }) => (
  <Box sx={{ mb: 3 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
      <Avatar sx={{ width: 22, height: 22, backgroundColor: 'primary.main' }}>
        <SmartToyIcon sx={{ fontSize: 13 }} />
      </Avatar>
      <Typography variant="caption" color="text.secondary" fontWeight={600}>AI 가이드</Typography>
    </Box>
    <Box sx={mdCardSx}>
      {message.isLoading ? <Spinner /> : (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
      )}
    </Box>
  </Box>
);

// 핀 공지 (첫 번째 어시스턴트 메시지)
const PinnedNotice = ({ message }: { message: Message }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box sx={{ borderBottom: '1px solid #ECECEC', backgroundColor: '#FAFAFA' }}>
      {/* 공지 바 */}
      <Box
        onClick={() => setExpanded(v => !v)}
        sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
      >
        <PushPinIcon sx={{ fontSize: 13, color: 'primary.main', flexShrink: 0 }} />
        <Typography
          variant="caption"
          sx={{ flex: 1, color: 'primary.main', fontWeight: 600 }}
        >
          투데이 가이드
        </Typography>
        <IconButton size="small" sx={{ p: 0, color: 'text.secondary' }}>
          {expanded ? <ExpandLessIcon sx={{ fontSize: 16 }} /> : <ExpandMoreIcon sx={{ fontSize: 16 }} />}
        </IconButton>
      </Box>

      {/* 펼쳐진 전체 내용 */}
      <Collapse in={expanded} unmountOnExit>
        <Box sx={{ px: 2, pb: 2, maxHeight: '55vh', overflowY: 'auto' }}>
          <Box sx={mdCardSx}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

const ChatBot = ({ messages }: Props) => {
  const { t } = useTranslation();

  if (messages.length === 0) {
    return (
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 2, gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 1.5, width: '95%' }}>
          <Box component="img" src={imgAlimjang} alt="알림장" sx={{ flex: 1, width: 0, aspectRatio: '1', objectFit: 'cover', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
          <Box component="img" src={imgGongji} alt="공지사항" sx={{ flex: 1, width: 0, aspectRatio: '1', objectFit: 'cover', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
        </Box>
        <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ whiteSpace: 'pre-line' }}>
          {t('main.emptyChat')}
        </Typography>
      </Box>
    );
  }

  // 첫 번째 assistant 메시지 → 핀 공지, 나머지 → 스크롤 영역
  const firstAssistantIdx = messages.findIndex(m => m.role === 'assistant');
  const pinnedMsg = firstAssistantIdx !== -1 ? messages[firstAssistantIdx] : null;
  const restMessages = messages.filter((_, i) => i !== firstAssistantIdx);

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {pinnedMsg && <PinnedNotice message={pinnedMsg} />}
      <Box sx={{ flex: 1, overflow: 'auto', px: 2, py: 2 }}>
        {restMessages.map((msg, i) =>
          msg.role === 'user'
            ? <UserBubble key={i} message={msg} />
            : <AssistantCard key={i} message={msg} />
        )}
      </Box>
    </Box>
  );
};

export default ChatBot;
