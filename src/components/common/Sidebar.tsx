import { useState, useEffect } from 'react';
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
import { getChatRooms } from '../../api/chat';
import { authStore } from '../../store/auth';
import logo from '../../assets/logo.png';

interface ChatRoom {
  roomId: number;
  date: string;
}

interface ChildChatGroup {
  childId: number;
  childName: string;
  chatRooms: ChatRoom[];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${String(d.getDate()).padStart(2, '0')}`;
}

interface DrawerProps {
  open: boolean;
  onClose: () => void;
}

const SidebarDrawer = ({ open, onClose }: DrawerProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [expandedChild, setExpandedChild] = useState<number | null>(null);
  const [childGroups, setChildGroups] = useState<ChildChatGroup[]>([]);

  useEffect(() => {
    if (!open) return;
    const userId = authStore.getUserId();
    if (!userId) return;
    getChatRooms(userId)
      .then((data) => {
        setChildGroups(data.result?.childChatGroups ?? []);
      })
      .catch(() => {});
  }, [open]);

  const handleNav = (path: string, state?: Record<string, unknown>) => {
    navigate(path, state ? { state } : undefined);
    onClose();
  };

  const toggleExpand = (id: number) => {
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
        <Box component="img" src={logo} alt="마마톨미" sx={{ width: 120 }} />
      </Box>

      <Divider />

      <List sx={{ px: 1, py: 1.5 }}>
        <ListItem disablePadding>
          <ListItemButton
            selected={location.pathname === '/'}
            onClick={() => handleNav('/')}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <HomeIcon sx={{ mr: 1.5, fontSize: 20, color: '#FCBE1D' }} />
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
        {childGroups.length === 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ px: 2, py: 1, display: 'block' }}>
            {t('sidebar.noChildren', '등록된 아이가 없어요')}
          </Typography>
        )}
        {childGroups.map((child) => {
          const isRecord = location.pathname === `/records/${child.childId}`;
          const isExpanded = expandedChild === child.childId;

          return (
            <ListItem key={child.childId} disablePadding sx={{ flexDirection: 'column', alignItems: 'stretch', mb: 0.5 }}>
              {/* 자녀 이름 행: 이름 클릭 → 기록 아카이브, 토글 클릭 → 채팅 목록 열기 */}
              <Box sx={{ display: 'flex', alignItems: 'center', borderRadius: 2, overflow: 'hidden', backgroundColor: isRecord ? 'action.selected' : 'transparent' }}>
                <ListItemButton
                  onClick={() => handleNav(`/records/${child.childId}`, { childName: child.childName })}
                  sx={{ borderRadius: 2, flex: 1, py: 1 }}
                >
                  <ChildCareIcon sx={{ mr: 1.5, fontSize: 20, color: '#1C40CF' }} />
                  <ListItemText
                    primary={child.childName}
                    slotProps={{ primary: { fontWeight: 500, fontSize: 14 } }}
                  />
                </ListItemButton>
                {child.chatRooms.length > 0 && (
                  <IconButton
                    size="small"
                    onClick={() => toggleExpand(child.childId)}
                    sx={{ mr: 0.5, color: 'text.secondary' }}
                  >
                    {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                  </IconButton>
                )}
              </Box>

              {/* 채팅방 날짜 목록 */}
              <Collapse in={isExpanded} unmountOnExit>
                <List disablePadding sx={{ pl: 4.5, pt: 0.5, pb: 0.5 }}>
                  {child.chatRooms.map((room) => {
                    const isActive =
                      location.pathname === `/child/${child.childId}` &&
                      (location.state as { roomId?: number } | null)?.roomId === room.roomId;
                    return (
                      <ListItemButton
                        key={room.roomId}
                        onClick={() =>
                          handleNav(`/child/${child.childId}`, {
                            childName: child.childName,
                            roomId: room.roomId,
                          })
                        }
                        sx={{ borderRadius: 1.5, py: 0.4, px: 1, mb: 0.25, minHeight: 0 }}
                      >
                        <CircleIcon sx={{ fontSize: 6, mr: 1, color: isActive ? 'primary.main' : '#D0D0D0' }} />
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: isActive ? 600 : 400, color: isActive ? 'primary.main' : 'text.primary' }}
                        >
                          {formatDate(room.date)}
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
            <SettingsIcon sx={{ mr: 1.5, fontSize: 20, color: '#F83C00' }} />
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
