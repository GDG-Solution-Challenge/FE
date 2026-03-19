import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ChildSummary from './ChildSummary';
import DailyList from './DailyList';
import bottom2Png from '../../assets/bottom2.png';
import { getKidDashboard, analyzeKid, type KidDashboardResult } from '../../api/kid';

const Records = () => {
  const { childId } = useParams<{ childId: string }>();
  const { t } = useTranslation();
  const locationState = useLocation().state as { childName?: string } | null;
  const childName = locationState?.childName ?? '알 수 없음';
  const [dashboard, setDashboard] = useState<KidDashboardResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!childId) return;
    getKidDashboard(Number(childId))
      .then((res) => { if (res.isSuccess) setDashboard(res.result); })
      .catch(() => {});
  }, [childId]);

  const handleAnalyze = async () => {
    if (!childId || analyzing) return;
    setAnalyzing(true);
    try {
      const res = await analyzeKid(Number(childId));
      if (res.isSuccess) setDashboard(res.result);
    } catch {
      // 실패 무시
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      <Box sx={{ height: '100%', overflow: 'auto', pt: 6 }}>
        <Box sx={{ px: 2, pt: 1, pb: 1.5, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5" fontWeight={700}>{childName}</Typography>
            <Typography variant="caption" color="text.secondary">{t('records.archive')}</Typography>
          </Box>
          <Button
            size="small"
            variant="contained"
            onClick={handleAnalyze}
            disabled={analyzing}
            startIcon={analyzing ? <CircularProgress size={13} sx={{ color: '#fff' }} /> : <AutoAwesomeIcon sx={{ fontSize: 14 }} />}
            sx={{ fontSize: 12, fontWeight: 600, borderRadius: 5, px: 1.5, py: 0.5, mb: 0.5, flexShrink: 0 }}
          >
            {analyzing ? '분석 중' : 'AI 분석'}
          </Button>
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
