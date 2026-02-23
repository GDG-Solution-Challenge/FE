import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import GoogleIcon from '@mui/icons-material/Google';

interface Props {
  onNext: () => void;
}

const GoogleLogin = ({ onNext }: Props) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 4, gap: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
          {t('onboarding.google.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
          {t('onboarding.google.subtitle')}
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
          '&:hover': { borderColor: '#BDBDBD', backgroundColor: '#F9F9F9' },
        }}
      >
        {t('onboarding.google.button')}
      </Button>
    </Box>
  );
};

export default GoogleLogin;
