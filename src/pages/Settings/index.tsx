import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import GoogleIcon from '@mui/icons-material/Google';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ChildCareIcon from '@mui/icons-material/ChildCare';

// TODO: 실제 데이터로 교체
const mockAccount = {
  name: '김부모',
  email: 'parent@gmail.com',
  photoUrl: '',
};

interface Child {
  id: string;
  name: string;
  gender: 'boy' | 'girl';
  age: number;
}

const mockChildrenInit: Child[] = [
  { id: '1', name: '김민준', gender: 'boy', age: 5 },
  { id: '2', name: '김서아', gender: 'girl', age: 4 },
];

const Settings = () => {
  const { t } = useTranslation();
  const [children, setChildren] = useState<Child[]>(mockChildrenInit);
  const [editTarget, setEditTarget] = useState<Child | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const openEdit = (child: Child) => {
    setEditTarget({ ...child });
    setDialogOpen(true);
  };

  const openAdd = () => {
    setEditTarget({ id: String(Date.now()), name: '', gender: 'boy', age: 5 });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!editTarget) return;
    setChildren(prev =>
      prev.some(c => c.id === editTarget.id)
        ? prev.map(c => (c.id === editTarget.id ? editTarget : c))
        : [...prev, editTarget]
    );
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setChildren(prev => prev.filter(c => c.id !== id));
  };

  return (
    <Box sx={{ height: '100%', overflow: 'auto', pt: 6 }}>
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
          {mockAccount.photoUrl ? (
            <Box component="img" src={mockAccount.photoUrl} sx={{ width: '100%', borderRadius: '50%' }} />
          ) : (
            <GoogleIcon sx={{ fontSize: 22 }} />
          )}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body2" fontWeight={600} noWrap>{mockAccount.name}</Typography>
          <Typography variant="caption" color="text.secondary" noWrap>{mockAccount.email}</Typography>
        </Box>
        <Button
          size="small"
          variant="outlined"
          color="error"
          sx={{ fontSize: 11, fontWeight: 500, flexShrink: 0 }}
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
        {children.map((child, i) => (
          <Box key={child.id}>
            <ListItem
              disablePadding
              sx={{ py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}
              secondaryAction={
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <IconButton size="small" onClick={() => openEdit(child)} sx={{ color: 'text.secondary' }}>
                    <EditIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(child.id)} sx={{ color: '#E53935' }}>
                    <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              }
            >
              <Avatar sx={{ width: 36, height: 36, backgroundColor: child.gender === 'boy' ? '#E3F2FD' : '#FCE4EC' }}>
                <ChildCareIcon sx={{ fontSize: 18, color: child.gender === 'boy' ? '#1565C0' : '#C62828' }} />
              </Avatar>
              <ListItemText
                primary={child.name}
                secondary={
                  <Box component="span" sx={{ display: 'flex', gap: 0.5, mt: 0.25 }}>
                    <Chip
                      label={t(child.gender === 'boy' ? 'onboarding.children.boy' : 'onboarding.children.girl')}
                      size="small"
                      sx={{ height: 18, fontSize: 10, backgroundColor: child.gender === 'boy' ? '#E3F2FD' : '#FCE4EC', color: child.gender === 'boy' ? '#1565C0' : '#C62828' }}
                    />
                    <Chip
                      label={`${child.age}${t('settings.ageUnit')}`}
                      size="small"
                      sx={{ height: 18, fontSize: 10, backgroundColor: '#F3F3F3', color: 'text.secondary' }}
                    />
                  </Box>
                }
                slotProps={{ primary: { fontWeight: 600, fontSize: '0.875rem' } }}
              />
            </ListItem>
            {i < children.length - 1 && <Divider sx={{ borderColor: '#F5F5F5' }} />}
          </Box>
        ))}
      </List>

      {/* 자녀 편집 다이얼로그 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1rem', pb: 1 }}>
          {editTarget && mockChildrenInit.some(c => c.id === editTarget.id)
            ? t('settings.editChild')
            : t('settings.addChild')}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label={t('onboarding.children.name')}
            size="small"
            fullWidth
            value={editTarget?.name ?? ''}
            onChange={e => setEditTarget(prev => prev ? { ...prev, name: e.target.value } : prev)}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            {(['boy', 'girl'] as const).map(g => (
              <Button
                key={g}
                variant={editTarget?.gender === g ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setEditTarget(prev => prev ? { ...prev, gender: g } : prev)}
                sx={{ flex: 1, fontWeight: 600 }}
              >
                {t(g === 'boy' ? 'onboarding.children.boy' : 'onboarding.children.girl')}
              </Button>
            ))}
          </Box>
          <TextField
            label={t('onboarding.children.age')}
            type="number"
            size="small"
            fullWidth
            value={editTarget?.age ?? 5}
            onChange={e => setEditTarget(prev => prev ? { ...prev, age: Number(e.target.value) } : prev)}
            slotProps={{ htmlInput: { min: 1, max: 10 } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit" size="small">{t('settings.cancel')}</Button>
          <Button onClick={handleSave} variant="contained" size="small" disabled={!editTarget?.name.trim()}>
            {t('settings.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings;
