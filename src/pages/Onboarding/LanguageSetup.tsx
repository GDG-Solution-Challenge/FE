import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import Box from '@mui/material/Box';
import { keyframes } from '@emotion/react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CircularProgress from '@mui/material/CircularProgress';
import { patchOnboarding } from '../../api/user';
import { authStore } from '../../store/auth';

const LANGUAGES = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'vi', label: 'Tiếng Việt' },
];

const twinkle = keyframes`
  0%, 100% { opacity: 0.15; transform: scale(0.8); }
  50%       { opacity: 1;    transform: scale(1.2); }
`;

const dotData = [
  { color: '#FCBE1D', left: '10%', top: '7%',  size: 9,  duration: 2.4, delay: 0.0 },
  { color: '#1C40CF', left: '55%', top: '5%',  size: 7,  duration: 3.1, delay: 0.7 },
  { color: '#F83C00', left: '82%', top: '18%', size: 10, duration: 2.8, delay: 1.2 },
  { color: '#029902', left: '30%', top: '22%', size: 8,  duration: 3.5, delay: 0.4 },
  { color: '#FCBE1D', left: '68%', top: '38%', size: 6,  duration: 2.2, delay: 1.8 },
  { color: '#1C40CF', left: '18%', top: '50%', size: 11, duration: 3.8, delay: 2.3 },
  { color: '#F83C00', left: '48%', top: '55%', size: 7,  duration: 2.6, delay: 0.9 },
  { color: '#029902', left: '85%', top: '60%', size: 8,  duration: 3.0, delay: 1.5 },
  { color: '#FCBE1D', left: '35%', top: '72%', size: 9,  duration: 2.7, delay: 0.6 },
  { color: '#1C40CF', left: '72%', top: '78%', size: 7,  duration: 3.4, delay: 1.1 },
  { color: '#F83C00', left: '12%', top: '85%', size: 8,  duration: 2.9, delay: 2.0 },
  { color: '#029902', left: '60%', top: '90%', size: 6,  duration: 3.2, delay: 0.3 },
];

const KO_LEVEL_MAP = { high: 'HIGH', mid: 'MID', low: 'LOW' } as const;
const RESPONSE_LANG_MAP = {
  ko: 'KOREAN',
  en: 'ENGLISH',
  zh: 'CHINESE',
  ja: 'JAPANESE',
  vi: 'VIETNAMESE',
} as const;

interface Props {
  onNext: () => void;
}

const LanguageSetup = ({ onNext }: Props) => {
  const { t } = useTranslation();
  const [nativeLang, setNativeLang] = useState('');
  const [koLevel, setKoLevel] = useState('');
  const [responseLang, setResponseLang] = useState('');
  const [loading, setLoading] = useState(false);

  const canProceed = nativeLang && koLevel && responseLang;

  const handleLangSelect = (code: string) => {
    setNativeLang(code);
    i18n.changeLanguage(code);
  };

  const handleNext = async () => {
    const userId = authStore.getUserId();
    if (!userId) return;
    setLoading(true);
    try {
      await patchOnboarding({
        userId,
        koreanLevel: KO_LEVEL_MAP[koLevel as keyof typeof KO_LEVEL_MAP],
        responseLanguage: RESPONSE_LANG_MAP[responseLang as keyof typeof RESPONSE_LANG_MAP],
      });
      onNext();
    } catch {
      // 실패해도 다음 단계로 진행
      onNext();
    } finally {
      setLoading(false);
    }
  };

  const KO_LEVELS = [
    { value: 'high', label: t('onboarding.language.levelHigh') },
    { value: 'mid', label: t('onboarding.language.levelMid') },
    { value: 'low', label: t('onboarding.language.levelLow') },
  ];

  const RESPONSE_LANGS = LANGUAGES.map((l) => ({ value: l.code, label: l.label }));

  return (
    <Box sx={{ minHeight: '100%', display: 'flex', flexDirection: 'column', px: 3, py: 4, position: 'relative', overflow: 'hidden' }}>
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
            zIndex: 0,
          }}
        />
      ))}
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ position: 'relative', zIndex: 1 }}>
        {t('onboarding.language.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {t('onboarding.language.subtitle')}
      </Typography>

      {/* 모국어 선택 */}
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
        {t('onboarding.language.nativeLang')}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3.5 }}>
        {LANGUAGES.map((lang) => (
          <Button
            key={lang.code}
            onClick={() => handleLangSelect(lang.code)}
            sx={{
              borderRadius: '20px',
              px: 2.5,
              py: 0.75,
              fontSize: 14,
              fontWeight: nativeLang === lang.code ? 700 : 500,
              border: nativeLang === lang.code
                ? '1px solid #029902'
                : '1px solid rgba(255,255,255,0.55)',
              backgroundColor: nativeLang === lang.code
                ? '#029902'
                : 'rgba(255,255,255,0.3)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: nativeLang === lang.code ? '#fff' : '#333',
              boxShadow: nativeLang === lang.code
                ? '0 4px 16px rgba(2,153,2,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                : '0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5)',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: nativeLang === lang.code
                  ? '#029902'
                  : 'rgba(255,255,255,0.5)',
              },
            }}
          >
            {lang.label}
          </Button>
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
        sx={{ mb: 3.5, gap: 1, flexWrap: 'wrap' }}
      >
        {KO_LEVELS.map((level) => (
          <ToggleButton
            key={level.value}
            value={level.value}
            sx={{
              borderRadius: '20px !important',
              px: 3,
              border: '1px solid rgba(255,255,255,0.55) !important',
              backgroundColor: 'rgba(255,255,255,0.3)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              fontWeight: 500,
              fontSize: 14,
              color: '#333',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5)',
              transition: 'all 0.2s ease',
              '&.Mui-selected': {
                backgroundColor: '#029902',
                border: '1px solid #029902 !important',
                color: '#fff',
                fontWeight: 700,
                boxShadow: '0 4px 16px rgba(2,153,2,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                '&:hover': { backgroundColor: '#029902' },
              },
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.5)' },
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
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
        {RESPONSE_LANGS.map((lang) => (
          <Button
            key={lang.value}
            onClick={() => setResponseLang(lang.value)}
            sx={{
              borderRadius: '20px',
              px: 2.5,
              py: 0.75,
              fontSize: 14,
              fontWeight: responseLang === lang.value ? 700 : 500,
              border: responseLang === lang.value
                ? '1px solid #029902'
                : '1px solid rgba(255,255,255,0.55)',
              backgroundColor: responseLang === lang.value
                ? '#029902'
                : 'rgba(255,255,255,0.3)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: responseLang === lang.value ? '#fff' : '#333',
              boxShadow: responseLang === lang.value
                ? '0 4px 16px rgba(2,153,2,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                : '0 2px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.5)',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: responseLang === lang.value
                  ? '#029902'
                  : 'rgba(255,255,255,0.5)',
              },
            }}
          >
            {lang.label}
          </Button>
        ))}
      </Box>

      <Button
        variant="contained"
        size="large"
        disabled={!canProceed || loading}
        onClick={handleNext}
        sx={{
          mt: 3, mb: 2, py: 1.5, borderRadius: 3,
          position: 'sticky', bottom: 16, zIndex: 1,
          fontWeight: 600, fontSize: 15,
          border: '1px solid rgba(255,255,255,0.4)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 4px 24px rgba(2,153,2,0.3), inset 0 1px 0 rgba(255,255,255,0.4)',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(2,153,2,0.4), inset 0 1px 0 rgba(255,255,255,0.5)',
            transform: 'translateY(-1px)',
          },
          '&.Mui-disabled': {
            backgroundColor: 'rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: 'none',
          },
        }}
      >
        {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : t('onboarding.language.next')}
      </Button>
    </Box>
  );
};

export default LanguageSetup;
