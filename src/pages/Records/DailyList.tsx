import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface DayRecord {
  date: string;
  dayLabel: string;
  hasRecord: boolean;
  summary?: string;
}

// TODO: 실제 데이터로 교체
const mockRecords: DayRecord[] = [
  { date: '02/17', dayLabel: '월', hasRecord: true, summary: '미술 활동: 봄 꽃 그리기. 준비물: 물감, 앞치마' },
  { date: '02/18', dayLabel: '화', hasRecord: true, summary: '신체 활동: 줄넘기. 내일 준비물: 운동화' },
  { date: '02/19', dayLabel: '수', hasRecord: false },
  { date: '02/20', dayLabel: '목', hasRecord: false },
  { date: '02/21', dayLabel: '금', hasRecord: false },
];

interface Props {
  childId: string;
}

const DailyList = ({ childId }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Box sx={{ px: 2, pb: 3 }}>
      <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 1.5, px: 0.5 }}>
        {t('records.weeklyRecords')}
      </Typography>
      {mockRecords.map((record, i) => (
        <Box key={record.date}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 1.75, gap: 1.5 }}>
            <Box sx={{ textAlign: 'center', minWidth: 36, flexShrink: 0 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>{record.dayLabel}</Typography>
              <Typography variant="body2" fontWeight={600}>{record.date}</Typography>
            </Box>
            {record.hasRecord ? (
              <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, backgroundColor: '#F0F7EE', border: '1px solid #25671E22', display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                <CheckCircleIcon sx={{ fontSize: 16, color: 'primary.main', mt: 0.2, flexShrink: 0 }} />
                <Typography variant="caption" sx={{ lineHeight: 1.6 }}>{record.summary}</Typography>
              </Box>
            ) : (
              <Box onClick={() => navigate(`/child/${childId}`)} sx={{ flex: 1, p: 1.5, borderRadius: 2, backgroundColor: '#F9F9F9', border: '1px dashed #E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', '&:active': { backgroundColor: '#F0F0F0' } }}>
                <Typography variant="caption" color="text.secondary">{t('records.noRecord')}</Typography>
                <Button size="small" startIcon={<AddPhotoAlternateIcon sx={{ fontSize: 14 }} />} sx={{ fontSize: 11, fontWeight: 500, py: 0.25, px: 1, minWidth: 0, color: 'text.secondary' }} onClick={(e) => e.stopPropagation()}>
                  {t('records.upload')}
                </Button>
              </Box>
            )}
          </Box>
          {i < mockRecords.length - 1 && <Divider sx={{ borderColor: '#F5F5F5' }} />}
        </Box>
      ))}
    </Box>
  );
};

export default DailyList;
