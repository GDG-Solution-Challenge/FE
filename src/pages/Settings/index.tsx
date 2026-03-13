import { useState, useEffect } from 'react';
import bottom2Png from '../../assets/bottom2.png';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import GoogleIcon from '@mui/icons-material/Google';
import AddIcon from '@mui/icons-material/Add';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { getUser } from '../../api/user';
import { getChatRooms } from '../../api/chat';
import { createKid } from '../../api/kid';
import { authStore } from '../../store/auth';

interface ChildItem {
  childId: number;
  childName: string;
}

interface NewChild {
  name: string;
  gender: 'boy' | 'girl';
  birthDate: string;
}

const Settings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [children, setChildren] = useState<ChildItem[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newChild, setNewChild] = useState<NewChild>({ name: '', gender: 'boy', birthDate: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const userId = authStore.getUserId();
    if (!userId) return;
    getUser(userId)
      .then((u) => setUser({ name: u.name, email: u.email }))
      .catch(() => {});
    getChatRooms(userId)
      .then((data) => {
        setChildren(
          (data.result?.childChatGroups ?? []).map((c) => ({
            childId: c.childId,
            childName: c.childName,
          }))
        );
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    authStore.clear();
    navigate('/onboarding', { replace: true });
  };

  const openAdd = () => {
    setNewChild({ name: '', gender: 'boy', birthDate: '' });
    setDialogOpen(true);
  };

  const handleAdd = async () => {
    const userId = authStore.getUserId();
    if (!userId || !newChild.name.trim() || !newChild.birthDate) return;
    setSaving(true);
    try {
      const res = await createKid(userId, {
        name: newChild.name.trim(),
        gender: newChild.gender === 'boy' ? 'MALE' : 'FEMALE',
        birthDate: newChild.birthDate,
      });
      if (res.isSuccess) {
        setChildren((prev) => [...prev, { childId: res.result.kidId, childName: newChild.name.trim() }]);
        setDialogOpen(false);
      }
    } catch {
      // 실패 시 다이얼로그 유지
    } finally {
      setSaving(false);
    }
  };

  const canAdd = newChild.name.trim() !== '' && newChild.birthDate !== '';

  return (
    <Box sx={{ height: '100%', overflow: 'auto', pt: 6, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 2, pt: 1, pb: 1.5 }}>
        <Typography variant="h5" fontWeight={700}>{t('settings.title')}</Typography>
      </Box>

      {/* 계정 섹션 */}
      <Box sx={{ px: 2, pt: 1, pb: 0.5 }}>
        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ letterSpacing: 0.5 }}>
          {t('settings.account')}
        </Typography>
      </Box>
      <Box sx={{ mx: 2, mb: 2, p: 2, borderRadius: 2.5, backgroundColor: '#fff', border: '1px solid #E8E8E8', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ width: 44, height: 44, backgroundColor: '#4285F4' }}>
          <GoogleIcon sx={{ fontSize: 22 }} />
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600} noWrap>
            {user?.name ?? '—'}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {user?.email ?? '—'}
          </Typography>
        </Box>
        <Button
          size="small"
          variant="outlined"
          color="error"
          sx={{ fontSize: 11, fontWeight: 500, flexShrink: 0 }}
          onClick={handleLogout}
        >
          {t('settings.logout')}
        </Button>
      </Box>

      <Divider sx={{ mx: 2, borderColor: '#F0F0F0', mb: 2 }} />

      {/* 자녀 설정 섹션 */}
      <Box sx={{ px: 2, pb: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ letterSpacing: 0.5 }}>
          {t('settings.children')}
        </Typography>
        <IconButton size="small" onClick={openAdd} sx={{ color: 'primary.main' }}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      <List sx={{ px: 2, pb: 3 }} disablePadding>
        {children.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            {t('settings.noChildren', '등록된 아이가 없어요')}
          </Typography>
        )}
        {children.map((child, i) => (
          <Box key={child.childId}>
            <ListItem disablePadding sx={{ py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{ width: 36, height: 36, backgroundColor: '#E8F5E9' }}>
                <ChildCareIcon sx={{ fontSize: 18, color: 'primary.main' }} />
              </Avatar>
              <ListItemText
                primary={child.childName}
                slotProps={{ primary: { fontWeight: 600, fontSize: '0.875rem' } }}
              />
            </ListItem>
            {i < children.length - 1 && <Divider sx={{ borderColor: '#F5F5F5' }} />}
          </Box>
        ))}
      </List>

      {/* 자녀 추가 다이얼로그 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1rem', pb: 1 }}>
          {t('settings.addChild')}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label={t('onboarding.children.name')}
            size="small"
            fullWidth
            value={newChild.name}
            onChange={(e) => setNewChild((prev) => ({ ...prev, name: e.target.value }))}
          />
          <ToggleButtonGroup
            value={newChild.gender}
            exclusive
            onChange={(_, val) => val && setNewChild((prev) => ({ ...prev, gender: val }))}
            sx={{ gap: 1 }}
          >
            {(['boy', 'girl'] as const).map((g) => (
              <ToggleButton
                key={g}
                value={g}
                size="small"
                sx={{
                  flex: 1,
                  borderRadius: '8px !important',
                  border: '1px solid #E0E0E0 !important',
                  fontWeight: 600,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: '#fff',
                    '&:hover': { backgroundColor: 'primary.dark' },
                  },
                }}
              >
                {t(g === 'boy' ? 'onboarding.children.boy' : 'onboarding.children.girl')}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <TextField
            label={t('onboarding.children.birthDate')}
            type="date"
            size="small"
            fullWidth
            value={newChild.birthDate}
            onChange={(e) => setNewChild((prev) => ({ ...prev, birthDate: e.target.value }))}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit" size="small">
            {t('settings.cancel')}
          </Button>
          <Button
            onClick={handleAdd}
            variant="contained"
            size="small"
            disabled={!canAdd || saving}
          >
            {saving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : t('settings.save')}
          </Button>
        </DialogActions>
      </Dialog>
      <Box component="img" src={bottom2Png} alt="" sx={{ width: '100%', display: 'block', pointerEvents: 'none', mt: 'auto' }} />
    </Box>
  );
};

export default Settings;
