import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import type { KidDashboardResult } from '../../api/kid';

interface Props {
  childName: string;
  dashboard: KidDashboardResult | null;
}

const ChildSummary = ({ childName, dashboard }: Props) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ px: 2, py: 2.5 }}>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        {t('records.summary', { name: childName })}
      </Typography>

      {/* 성격 분석 */}
      <Box sx={{ mb: 2.5, p: 2, borderRadius: 2.5, backgroundColor: '#F0F7EE', border: '1px solid #25671E22' }}>
        <Typography variant="caption" fontWeight={600} color="primary" sx={{ display: 'block', mb: 0.75 }}>
          {t('records.personality')}
        </Typography>
        {dashboard ? (
          <Typography variant="body2" sx={{ lineHeight: 1.7 }}>{dashboard.analysis}</Typography>
        ) : (
          <Skeleton variant="text" width="100%" />
        )}
      </Box>

      {/* 강점 */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          {t('records.strengths')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {dashboard ? (
            dashboard.strengths.length > 0
              ? dashboard.strengths.map((s) => (
                  <Chip key={s} label={s} size="small" sx={{ backgroundColor: 'secondary.main', color: '#fff', fontWeight: 500 }} />
                ))
              : <Typography variant="caption" color="text.secondary">—</Typography>
          ) : (
            [1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" width={56} height={24} />)
          )}
        </Box>
      </Box>

      {/* 종합 피드백 */}
      <Box sx={{ p: 2, borderRadius: 2.5, backgroundColor: '#F7F7F7' }}>
        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
          {t('records.feedback')}
        </Typography>
        {dashboard ? (
          <Typography variant="body2" sx={{ lineHeight: 1.7 }}>{dashboard.comprehensiveFeedback}</Typography>
        ) : (
          <Skeleton variant="text" width="100%" />
        )}
      </Box>
    </Box>
  );
};

export default ChildSummary;
