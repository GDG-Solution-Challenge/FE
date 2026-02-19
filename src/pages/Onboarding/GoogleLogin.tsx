import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import GoogleIcon from '@mui/icons-material/Google';

interface Props {
  onNext: () => void;
}

const GoogleLogin = ({ onNext }: Props) => {
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 4,
        gap: 3,
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
          키즈노트 도우미
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
          {'언어·문화 장벽이 있는 학부모를 위한\n키즈노트 요약 및 육아 가이드 플랫폼'}
        </Typography>
      </Box>

      <Button
        variant="outlined"
        size="large"
        startIcon={<GoogleIcon />}
        onClick={onNext}
        sx={{
          width: '100%',
          maxWidth: 320,
          py: 1.5,
          borderColor: '#E0E0E0',
          color: '#000',
          backgroundColor: '#fff',
          fontWeight: 500,
          fontSize: 15,
          '&:hover': {
            borderColor: '#BDBDBD',
            backgroundColor: '#F9F9F9',
          },
        }}
      >
        Google로 시작하기
      </Button>
    </Box>
  );
};

export default GoogleLogin;
