import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import Spinner from '../../components/common/Spinner';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
}

interface Props {
  messages: Message[];
}

const ChatBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: 1,
        mb: 2,
      }}
    >
      <Avatar
        sx={{
          width: 28,
          height: 28,
          backgroundColor: isUser ? 'secondary.main' : 'primary.main',
          flexShrink: 0,
        }}
      >
        {isUser ? <PersonIcon sx={{ fontSize: 16 }} /> : <SmartToyIcon sx={{ fontSize: 16 }} />}
      </Avatar>

      <Box
        sx={{
          maxWidth: '72%',
          px: 2,
          py: 1.25,
          borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
          backgroundColor: isUser ? 'primary.main' : '#F3F3F3',
          color: isUser ? '#fff' : '#000',
        }}
      >
        {message.isLoading ? (
          <Spinner />
        ) : (
          <Typography variant="body2" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {message.content}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const ChatBot = ({ messages }: Props) => {
  if (messages.length === 0) {
    return (
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 4, gap: 1 }}>
        <SmartToyIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.4 }} />
        <Typography variant="body2" color="text.secondary" textAlign="center">
          키즈노트 내용을 업로드하거나{'\n'}궁금한 점을 물어보세요
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, overflow: 'auto', px: 2, py: 2 }}>
      {messages.map((msg, i) => (
        <ChatBubble key={i} message={msg} />
      ))}
    </Box>
  );
};

export default ChatBot;
