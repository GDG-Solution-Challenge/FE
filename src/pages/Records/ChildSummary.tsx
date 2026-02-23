import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

interface Props {
  childName: string;
}

// TODO: 실제 데이터로 교체
const mockSummary = {
  personality: '활발하고 호기심이 많은 성격으로, 새로운 활동에 적극적으로 참여합니다.',
  strengths: ['창의력', '사회성', '리더십'],
  feedback: '또래 친구들과의 협동 활동에서 두드러진 참여도를 보이고 있어요. 집에서도 다양한 미술 활동을 격려해주세요.',
};

const ChildSummary = ({ childName }: Props) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ px: 2, py: 2.5 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        {t('records.summary', { name: childName })}
      </Typography>
      <Box sx={{ mb: 2.5, p: 2, borderRadius: 2.5, backgroundColor: '#F0F7EE', border: '1px solid #25671E22' }}>
        <Typography variant="caption" fontWeight={600} color="primary" sx={{ display: 'block', mb: 0.75 }}>
          {t('records.personality')}
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.7 }}>{mockSummary.personality}</Typography>
      </Box>
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          {t('records.strengths')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {mockSummary.strengths.map((s) => (
            <Chip key={s} label={s} size="small" sx={{ backgroundColor: 'secondary.main', color: '#fff', fontWeight: 500 }} />
          ))}
        </Box>
      </Box>
      <Box sx={{ p: 2, borderRadius: 2.5, backgroundColor: '#F7F7F7' }}>
        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
          {t('records.feedback')}
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.7 }}>{mockSummary.feedback}</Typography>
      </Box>
    </Box>
  );
};

export default ChildSummary;
