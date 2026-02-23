import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const LANGUAGES = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'fil', label: 'Filipino' },
];

interface Props {
  onNext: () => void;
}

const LanguageSetup = ({ onNext }: Props) => {
  const { t } = useTranslation();
  const [nativeLang, setNativeLang] = useState('');
  const [koLevel, setKoLevel] = useState('');
  const [responseLang, setResponseLang] = useState('');

  const canProceed = nativeLang && koLevel && responseLang;

  const handleLangSelect = (code: string) => {
    setNativeLang(code);
    i18n.changeLanguage(code);
  };

  const KO_LEVELS = [
    { value: 'high', label: t('onboarding.language.levelHigh') },
    { value: 'mid', label: t('onboarding.language.levelMid') },
    { value: 'low', label: t('onboarding.language.levelLow') },
  ];

  const RESPONSE_LANGS = [
    { value: 'native', label: t('onboarding.language.responseNative') },
    { value: 'both', label: t('onboarding.language.responseBoth') },
    { value: 'korean', label: t('onboarding.language.responseKorean') },
  ];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', px: 3, py: 4, overflow: 'auto' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {t('onboarding.language.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {t('onboarding.language.subtitle')}
      </Typography>

      {/* 모국어 선택 */}
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
        {t('onboarding.language.nativeLang')}
      </Typography>
      <Box
        sx={{
          overflowY: 'auto',
          maxHeight: 200,
          mb: 3.5,
          border: '1px solid #F0F0F0',
          borderRadius: 2,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#E0E0E0', borderRadius: 4 },
        }}
      >
        {LANGUAGES.map((lang, i) => (
          <Box
            key={lang.code}
            onClick={() => handleLangSelect(lang.code)}
            sx={{
              px: 2,
              py: 1.25,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: nativeLang === lang.code ? '#F0F7EE' : 'transparent',
              borderBottom: i < LANGUAGES.length - 1 ? '1px solid #F5F5F5' : 'none',
              '&:hover': { backgroundColor: nativeLang === lang.code ? '#F0F7EE' : '#FAFAFA' },
            }}
          >
            <Typography variant="body2" fontWeight={nativeLang === lang.code ? 600 : 400}>
              {lang.label}
            </Typography>
            {nativeLang === lang.code && (
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'primary.main', flexShrink: 0 }} />
            )}
          </Box>
        ))}
      </Box>

      {/* 한국어 실력 */}
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
        {t('onboarding.language.koreanLevel')}
      </Typography>
      <ToggleButtonGroup
        value={koLevel}
        exclusive
        onChange={(_, val) => val && setKoLevel(val)}
        sx={{ mb: 3.5, gap: 1 }}
      >
        {KO_LEVELS.map((level) => (
          <ToggleButton
            key={level.value}
            value={level.value}
            sx={{
              borderRadius: '20px !important',
              px: 3,
              border: '1px solid #E0E0E0 !important',
              fontWeight: 500,
              fontSize: 14,
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: '#fff',
                '&:hover': { backgroundColor: 'primary.dark' },
              },
            }}
          >
            {level.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {/* AI 응답 언어 */}
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
        {t('onboarding.language.responseLang')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 4 }}>
        {RESPONSE_LANGS.map((lang) => (
          <Button
            key={lang.value}
            variant={responseLang === lang.value ? 'contained' : 'outlined'}
            onClick={() => setResponseLang(lang.value)}
            sx={{
              justifyContent: 'flex-start',
              borderRadius: 2,
              py: 1.25,
              px: 2.5,
              fontSize: 14,
              fontWeight: 500,
              borderColor: responseLang === lang.value ? 'primary.main' : '#E0E0E0',
              color: responseLang === lang.value ? '#fff' : '#000',
            }}
          >
            {lang.label}
          </Button>
        ))}
      </Box>

      <Button
        variant="contained"
        size="large"
        disabled={!canProceed}
        onClick={onNext}
        sx={{ mt: 'auto', py: 1.5, fontWeight: 600, fontSize: 15, borderRadius: 2 }}
      >
        {t('onboarding.language.next')}
      </Button>
    </Box>
  );
};

export default LanguageSetup;
