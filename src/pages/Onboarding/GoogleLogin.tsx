import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import GoogleIcon from '@mui/icons-material/Google';
import { keyframes } from '@emotion/react';
import logo from '../../assets/logo.png';

const GOOGLE_OAUTH_URL = 'https://mamatolmi-server-163838471205.asia-northeast3.run.app/oauth2/authorization/google';

const twinkle = keyframes`
  0%, 100% {
    opacity: 0.15;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
`;

const dotData = [
  { color: '#FCBE1D', left: '8%',  top: '9%',  size: 10, duration: 2.4, delay: 0.0 },
  { color: '#1C40CF', left: '32%', top: '6%',  size:  7, duration: 3.1, delay: 0.6 },
  { color: '#F83C00', left: '62%', top: '11%', size: 12, duration: 2.8, delay: 1.0 },
  { color: '#029902', left: '88%', top: '7%',  size:  8, duration: 3.5, delay: 1.5 },
  { color: '#FCBE1D', left: '20%', top: '28%', size:  6, duration: 2.2, delay: 0.8 },
  { color: '#1C40CF', left: '50%', top: '24%', size: 11, duration: 3.8, delay: 2.0 },
  { color: '#F83C00', left: '78%', top: '32%', size:  7, duration: 2.6, delay: 0.3 },
  { color: '#029902', left: '10%', top: '47%', size:  9, duration: 3.0, delay: 2.5 },
  { color: '#FCBE1D', left: '42%', top: '51%', size:  8, duration: 2.9, delay: 1.2 },
  { color: '#1C40CF', left: '73%', top: '55%', size:  6, duration: 3.3, delay: 0.7 },
  { color: '#F83C00', left: '25%', top: '68%', size: 10, duration: 2.5, delay: 3.0 },
  { color: '#029902', left: '57%', top: '72%', size:  7, duration: 3.6, delay: 1.8 },
  { color: '#FCBE1D', left: '87%', top: '66%', size:  9, duration: 2.7, delay: 0.4 },
  { color: '#1C40CF', left: '15%', top: '84%', size:  8, duration: 3.2, delay: 2.2 },
  { color: '#F83C00', left: '45%', top: '88%', size:  6, duration: 2.3, delay: 1.6 },
  { color: '#029902', left: '80%', top: '85%', size: 10, duration: 3.4, delay: 0.9 },
];

const GoogleLogin = () => {
  const { t } = useTranslation();

  const handleLogin = () => {
    const redirectUri = `${window.location.origin}/oauth-success`;
    window.location.href = `${GOOGLE_OAUTH_URL}?redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 4, gap: 3, position: 'relative', overflow: 'hidden' }}>
      {dotData.map((dot, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            top: dot.top,
            left: dot.left,
            width: dot.size,
            height: dot.size,
            borderRadius: '50%',
            backgroundColor: dot.color,
            animation: `${twinkle} ${dot.duration}s ${dot.delay}s infinite ease-in-out`,
            pointerEvents: 'none',
          }}
        />
      ))}

      <Box sx={{ textAlign: 'center', mb: 2, position: 'relative', zIndex: 1 }}>
        <Box component="img" src={logo} alt="마마톨미" sx={{ width: 160, mb: 2 }} />
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
          {'키즈노트 분석부터 가정 보육까지,\n다문화 가정을 위한 AI 보육 가이드'}
        </Typography>
      </Box>

      <Button
        variant="outlined"
        size="large"
        startIcon={<GoogleIcon />}
        onClick={handleLogin}
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 320,
          py: 1.5,
          borderRadius: 3,
          border: '1px solid rgba(255,255,255,0.55)',
          color: '#222',
          backgroundColor: 'rgba(255,255,255,0.35)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.6)',
          fontWeight: 600,
          fontSize: 15,
          letterSpacing: 0.2,
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.55)',
            border: '1px solid rgba(255,255,255,0.8)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)',
            transform: 'translateY(-1px)',
          },
        }}
      >
        {t('onboarding.google.button')}
      </Button>
    </Box>
  );
};

export default GoogleLogin;
