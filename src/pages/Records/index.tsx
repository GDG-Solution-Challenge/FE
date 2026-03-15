import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ChildSummary from './ChildSummary';
import DailyList from './DailyList';
import bottom2Png from '../../assets/bottom2.png';
import { getKidDashboard, type KidDashboardResult } from '../../api/kid';

const Records = () => {
  const { childId } = useParams<{ childId: string }>();
  const { t } = useTranslation();
  const locationState = useLocation().state as { childName?: string } | null;
  const childName = locationState?.childName ?? '알 수 없음';
  const [dashboard, setDashboard] = useState<KidDashboardResult | null>(null);

  useEffect(() => {
    if (!childId) return;
    getKidDashboard(Number(childId))
      .then((res) => { if (res.isSuccess) setDashboard(res.result); })
      .catch(() => {});
  }, [childId]);

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      <Box sx={{ height: '100%', overflow: 'auto', pt: 6 }}>
        <Box sx={{ px: 2, pt: 1, pb: 1.5 }}>
          <Typography variant="h5" fontWeight={700}>{childName}</Typography>
          <Typography variant="caption" color="text.secondary">{t('records.archive')}</Typography>
        </Box>
        <ChildSummary childName={childName} dashboard={dashboard} />
        <Divider sx={{ mx: 2, borderColor: '#F0F0F0' }} />
        <DailyList childId={childId ?? ''} childName={childName} weeklyRecords={dashboard?.weeklyRecords} />
      </Box>
      <Box
        component="img"
        src={bottom2Png}
        alt=""
        sx={{ position: 'absolute', bottom: 0, left: 0, width: '100%', pointerEvents: 'none', zIndex: 0 }}
      />
    </Box>
  );
};

export default Records;
