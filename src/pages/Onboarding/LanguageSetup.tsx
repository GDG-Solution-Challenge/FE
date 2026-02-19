import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const LANGUAGES = ['한국어', '영어', '중국어', '일본어', '베트남어', '필리핀어', '태국어', '인도네시아어'];
const KO_LEVELS = ['상', '중', '하'];
const RESPONSE_LANGS = ['모국어', '모국어 + 한국어', '한국어'];

interface Props {
  onNext: () => void;
}

const LanguageSetup = ({ onNext }: Props) => {
  const [nativeLang, setNativeLang] = useState('');
  const [koLevel, setKoLevel] = useState('');
  const [responseLang, setResponseLang] = useState('');

  const canProceed = nativeLang && koLevel && responseLang;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', px: 3, py: 4, overflow: 'auto' }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        언어 설정
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        편한 언어로 도움을 드릴게요
      </Typography>

      {/* 모국어 선택 */}
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
        모국어
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3.5 }}>
        {LANGUAGES.map((lang) => (
          <Button
            key={lang}
            variant={nativeLang === lang ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setNativeLang(lang)}
            sx={{
              borderRadius: 5,
              px: 2,
              py: 0.75,
              fontSize: 13,
              fontWeight: 500,
              borderColor: nativeLang === lang ? 'primary.main' : '#E0E0E0',
              color: nativeLang === lang ? '#fff' : '#000',
            }}
          >
            {lang}
          </Button>
        ))}
      </Box>

      {/* 한국어 실력 */}
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
        한국어 실력
      </Typography>
      <ToggleButtonGroup
        value={koLevel}
        exclusive
        onChange={(_, val) => val && setKoLevel(val)}
        sx={{ mb: 3.5, gap: 1 }}
      >
        {KO_LEVELS.map((level) => (
          <ToggleButton
            key={level}
            value={level}
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
            {level}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {/* AI 응답 언어 */}
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
        AI 응답 언어
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 4 }}>
        {RESPONSE_LANGS.map((lang) => (
          <Button
            key={lang}
            variant={responseLang === lang ? 'contained' : 'outlined'}
            onClick={() => setResponseLang(lang)}
            sx={{
              justifyContent: 'flex-start',
              borderRadius: 2,
              py: 1.25,
              px: 2.5,
              fontSize: 14,
              fontWeight: 500,
              borderColor: responseLang === lang ? 'primary.main' : '#E0E0E0',
              color: responseLang === lang ? '#fff' : '#000',
            }}
          >
            {lang}
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
        다음
      </Button>
    </Box>
  );
};

export default LanguageSetup;
