import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
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
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircleIcon from '@mui/icons-material/Circle';
import SettingsIcon from '@mui/icons-material/Settings';

// TODO: 실제 자녀 데이터로 교체
const mockChildren = [
  { id: '1', name: '김민준' },
  { id: '2', name: '김서아' },
];

// 이번 주 월~금 날짜 생성 (오늘 기준)
function getWeekDates() {
  const today = new Date();
  const day = today.getDay(); // 0=일, 1=월
  const monday = new Date(today);
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      label: `${d.getMonth() + 1}/${String(d.getDate()).padStart(2, '0')}`,
      dateStr: d.toISOString().slice(0, 10),
    };
  });
}

// TODO: 실제 채팅 존재 여부 데이터로 교체
const mockChatDates: Record<string, string[]> = {
  '1': ['2026-02-17', '2026-02-18', '2026-02-23'],
  '2': ['2026-02-17'],
};

const weekDates = getWeekDates();

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

const SidebarDrawer = ({ open, onClose }: DrawerProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [expandedChild, setExpandedChild] = useState<string | null>(null);

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  const toggleExpand = (id: string) => {
    setExpandedChild((prev) => (prev === id ? null : id));
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
          const isRecord = location.pathname === `/records/${child.id}`;
          const isExpanded = expandedChild === child.id;
          const chatDates = mockChatDates[child.id] ?? [];

          return (
            <ListItem key={child.id} disablePadding sx={{ flexDirection: 'column', alignItems: 'stretch', mb: 0.5 }}>
              {/* 자녀 이름 행: 이름 클릭 → 기록 아카이브, 토글 클릭 → 채팅 목록 열기 */}
              <Box sx={{ display: 'flex', alignItems: 'center', borderRadius: 2, overflow: 'hidden', backgroundColor: isRecord ? 'action.selected' : 'transparent' }}>
                <ListItemButton
                  onClick={() => handleNav(`/records/${child.id}`)}
                  sx={{ borderRadius: 2, flex: 1, py: 1 }}
                >
                  <ChildCareIcon sx={{ mr: 1.5, fontSize: 20, color: 'secondary.main' }} />
                  <ListItemText
                    primary={child.name}
                    slotProps={{ primary: { fontWeight: 500, fontSize: 14 } }}
                  />
                </ListItemButton>
                <IconButton
                  size="small"
                  onClick={() => toggleExpand(child.id)}
                  sx={{ mr: 0.5, color: 'text.secondary' }}
                >
                  {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                </IconButton>
              </Box>

              {/* 주간 채팅 날짜 목록 */}
              <Collapse in={isExpanded} unmountOnExit>
                <List disablePadding sx={{ pl: 4.5, pt: 0.5, pb: 0.5 }}>
                  {weekDates.map(({ label, dateStr }) => {
                    const hasChat = chatDates.includes(dateStr);
                    const isActive = location.pathname === `/child/${child.id}`;
                    return (
                      <ListItemButton
                        key={dateStr}
                        disabled={!hasChat}
                        onClick={() => hasChat && handleNav(`/child/${child.id}`)}
                        sx={{ borderRadius: 1.5, py: 0.4, px: 1, mb: 0.25, minHeight: 0 }}
                      >
                        <CircleIcon sx={{ fontSize: 6, mr: 1, color: hasChat ? 'primary.main' : '#D0D0D0' }} />
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: hasChat ? 600 : 400, color: hasChat ? (isActive ? 'primary.main' : 'text.primary') : '#C0C0C0' }}
                        >
                          {label}
                        </Typography>
                      </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      <List sx={{ px: 1, py: 1 }}>
        <ListItem disablePadding>
          <ListItemButton
            selected={location.pathname === '/settings'}
            onClick={() => handleNav('/settings')}
            sx={{ borderRadius: 2 }}
          >
            <SettingsIcon sx={{ mr: 1.5, fontSize: 20, color: 'text.secondary' }} />
            <ListItemText
              primary={t('sidebar.settings')}
              slotProps={{ primary: { fontWeight: 500, fontSize: 14 } }}
            />
          </ListItemButton>
        </ListItem>
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
