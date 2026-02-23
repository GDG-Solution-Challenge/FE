import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ChildCareIcon from '@mui/icons-material/ChildCare';

// TODO: 실제 자녀 데이터로 교체
const mockChildren = [
  { id: '1', name: '김민준' },
  { id: '2', name: '김서아' },
];

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

const SidebarDrawer = ({ open, onClose }: DrawerProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: 260,
            maxWidth: '80vw',
            backgroundColor: '#fff',
            borderRight: '1px solid #E8E8E8',
          },
        },
      }}
    >
      <Box sx={{ px: 2.5, py: 3 }}>
        <Typography variant="h6" fontWeight={700} color="primary">
          {t('appName')}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t('appSubtitle')}
        </Typography>
      </Box>

      <Divider />

      <List sx={{ px: 1, py: 1.5 }}>
        <ListItem disablePadding>
          <ListItemButton
            selected={location.pathname === '/'}
            onClick={() => handleNav('/')}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <HomeIcon sx={{ mr: 1.5, fontSize: 20, color: 'primary.main' }} />
            <ListItemText
              primary={t('sidebar.home')}
              slotProps={{ primary: { fontWeight: 500, fontSize: 14 } }}
            />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />

      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ letterSpacing: 0.5 }}>
          {t('sidebar.children')}
        </Typography>
      </Box>

      <List sx={{ px: 1 }}>
        {mockChildren.map((child) => {
          const isChat = location.pathname === `/child/${child.id}`;
          const isRecord = location.pathname === `/records/${child.id}`;
          return (
            <ListItem key={child.id} disablePadding sx={{ flexDirection: 'column', alignItems: 'stretch', mb: 0.5 }}>
              {/* 자녀 이름 - 클릭 시 채팅 이동 */}
              <ListItemButton
                selected={isChat}
                onClick={() => handleNav(`/child/${child.id}`)}
                sx={{ borderRadius: 2 }}
              >
                <ChildCareIcon sx={{ mr: 1.5, fontSize: 20, color: 'secondary.main' }} />
                <ListItemText
                  primary={child.name}
                  slotProps={{ primary: { fontWeight: 500, fontSize: 14 } }}
                />
              </ListItemButton>
              {/* 기록 서브메뉴 */}
              <ListItemButton
                selected={isRecord}
                onClick={() => handleNav(`/records/${child.id}`)}
                sx={{ borderRadius: 2, pl: 5.5, py: 0.5, minHeight: 0 }}
              >
                <ListItemText
                  primary={t('sidebar.viewRecords')}
                  slotProps={{ primary: { fontSize: 12, color: isRecord ? 'primary.main' : 'text.secondary' } }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 10,
          backgroundColor: 'rgba(255,255,255,0.9)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
          '&:hover': { backgroundColor: '#fff' },
        }}
        size="small"
      >
        <MenuIcon fontSize="small" />
      </IconButton>
      <SidebarDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default Sidebar;
