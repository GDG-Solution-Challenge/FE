import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { createKid } from '../../api/kid';
import { authStore } from '../../store/auth';

interface Child {
  name: string;
  gender: string;
  birthDate: string;
}

interface Props {
  onNext: () => void;
}

const ChildrenSetup = ({ onNext }: Props) => {
  const { t } = useTranslation();
  const [count, setCount] = useState(1);
  const [children, setChildren] = useState<Child[]>([{ name: '', gender: '', birthDate: '' }]);
  const [loading, setLoading] = useState(false);

  const updateCount = (next: number) => {
    if (next < 1 || next > 5) return;
    setCount(next);
    setChildren((prev) => {
      if (next > prev.length) {
        return [...prev, ...Array(next - prev.length).fill({ name: '', gender: '', birthDate: '' })];
      }
      return prev.slice(0, next);
    });
  };

  const updateChild = (i: number, field: keyof Child, value: string) => {
    setChildren((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
  };

  const canProceed = children.every((c) => c.name && c.gender && c.birthDate);

  const handleNext = async () => {
    const userId = authStore.getUserId();
    if (!userId) return;
    setLoading(true);
    try {
      await Promise.all(
        children.map((child) =>
          createKid(userId, {
            name: child.name,
            gender: child.gender === 'boy' ? 'MALE' : 'FEMALE',
            birthDate: child.birthDate,
          })
        )
      );
      onNext();
    } catch {
      // 실패해도 다음 단계로 진행
      onNext();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100%', display: 'flex', flexDirection: 'column', px: 3, py: 4 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {t('onboarding.children.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {t('onboarding.children.subtitle')}
      </Typography>

      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
        {t('onboarding.children.count')}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3.5 }}>
        <IconButton onClick={() => updateCount(count - 1)} disabled={count <= 1} size="small" sx={{ border: '1px solid #E0E0E0', borderRadius: 1.5 }}>
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Typography variant="h6" fontWeight={600} sx={{ minWidth: 20, textAlign: 'center' }}>{count}</Typography>
        <IconButton onClick={() => updateCount(count + 1)} disabled={count >= 5} size="small" sx={{ border: '1px solid #E0E0E0', borderRadius: 1.5 }}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      {children.map((child, i) => (
        <Box key={i} sx={{ mb: 3, p: 2.5, border: '1px solid #F0F0F0', borderRadius: 3, backgroundColor: '#FAFAFA' }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2, color: 'primary.main' }}>
            {t('onboarding.children.childLabel', { count: i + 1 })}
          </Typography>

          <TextField
            label={t('onboarding.children.name')}
            value={child.name}
            onChange={(e) => updateChild(i, 'name', e.target.value)}
            fullWidth size="small" sx={{ mb: 2 }}
          />

          <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            {t('onboarding.children.gender')}
          </Typography>
          <ToggleButtonGroup
            value={child.gender}
            exclusive
            onChange={(_, val) => val && updateChild(i, 'gender', val)}
            sx={{ mb: 2, gap: 1, flexWrap: 'wrap' }}
          >
            {[
              { value: 'boy', label: t('onboarding.children.boy') },
              { value: 'girl', label: t('onboarding.children.girl') },
            ].map((g) => (
              <ToggleButton key={g.value} value={g.value} size="small" sx={{ borderRadius: '16px !important', px: 2.5, border: '1px solid #E0E0E0 !important', fontWeight: 500, fontSize: 13, '&.Mui-selected': { backgroundColor: 'primary.main', color: '#fff', '&:hover': { backgroundColor: 'primary.dark' } } }}>
                {g.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <TextField
            label={t('onboarding.children.birthDate')}
            value={child.birthDate}
            onChange={(e) => updateChild(i, 'birthDate', e.target.value)}
            fullWidth size="small" type="date"
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Box>
      ))}

      <Button
        variant="contained" size="large" disabled={!canProceed || loading} onClick={handleNext}
        sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: 600, fontSize: 15, borderRadius: 2, position: 'sticky', bottom: 16, zIndex: 1 }}
      >
        {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : t('onboarding.children.start')}
      </Button>
    </Box>
  );
};

export default ChildrenSetup;
