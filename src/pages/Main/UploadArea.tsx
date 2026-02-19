import { useRef } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import ImageIcon from '@mui/icons-material/Image';
import SendIcon from '@mui/icons-material/Send';

interface Props {
  input: string;
  onInputChange: (val: string) => void;
  onSend: () => void;
  onImageUpload: (file: File) => void;
  disabled?: boolean;
}

const UploadArea = ({ input, onInputChange, onSend, onImageUpload, disabled }: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 1,
        px: 2,
        py: 1.5,
        borderTop: '1px solid #F0F0F0',
        backgroundColor: '#fff',
      }}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => e.target.files?.[0] && onImageUpload(e.target.files[0])}
      />
      <IconButton
        onClick={() => fileRef.current?.click()}
        disabled={disabled}
        size="small"
        sx={{ color: 'text.secondary', flexShrink: 0 }}
      >
        <ImageIcon />
      </IconButton>

      <TextField
        multiline
        maxRows={4}
        fullWidth
        placeholder="키즈노트 내용을 입력하거나 사진을 업로드하세요"
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        size="small"
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            fontSize: 14,
            backgroundColor: '#F7F7F7',
            '& fieldset': { border: 'none' },
          },
        }}
      />

      <IconButton
        onClick={onSend}
        disabled={disabled || !input.trim()}
        size="small"
        sx={{
          backgroundColor: 'primary.main',
          color: '#fff',
          flexShrink: 0,
          '&:hover': { backgroundColor: 'primary.dark' },
          '&:disabled': { backgroundColor: '#E0E0E0', color: '#fff' },
        }}
      >
        <SendIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default UploadArea;
