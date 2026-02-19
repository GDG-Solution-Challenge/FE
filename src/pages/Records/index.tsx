import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ChildSummary from './ChildSummary';
import DailyList from './DailyList';

// TODO: 실제 자녀 데이터로 교체
const mockChildMap: Record<string, string> = {
  '1': '김민준',
  '2': '김서아',
};

const Records = () => {
  const { childId } = useParams<{ childId: string }>();
  const childName = childId ? (mockChildMap[childId] ?? '알 수 없음') : '알 수 없음';

  return (
    <Box sx={{ height: '100%', overflow: 'auto', pt: 6 }}>
      <Box sx={{ px: 2, pt: 1, pb: 1.5 }}>
        <Typography variant="h5" fontWeight={700}>
          {childName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          프로필 기록 아카이브
        </Typography>
      </Box>

      <ChildSummary childName={childName} />
      <Divider sx={{ mx: 2, borderColor: '#F0F0F0' }} />
      <DailyList />
    </Box>
  );
};

export default Records;
