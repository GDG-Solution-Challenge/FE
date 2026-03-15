import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { getChatRooms } from '../../api/chat';
import { authStore } from '../../store/auth';
import type { DailyRecord } from '../../api/kid';

const DAY_LABELS = ['월', '화', '수', '목', '금'];

const DAY_OF_WEEK_MAP: Record<string, string> = {
  MONDAY: '월', TUESDAY: '화', WEDNESDAY: '수', THURSDAY: '목', FRIDAY: '금',
  SATURDAY: '토', SUNDAY: '일',
};

function parseDateLabel(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  const iso = dateStr.slice(0, 10);
  const parts = iso.split('-');
  if (parts.length < 3) return '—';
  const m = Number(parts[1]);
  const d = parts[2];
  return isNaN(m) ? '—' : `${m}/${d}`;
}

function getThisWeekDates() {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      dayLabel: DAY_LABELS[i],
      dateLabel: `${d.getMonth() + 1}/${String(d.getDate()).padStart(2, '0')}`,
      isoDate: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    };
  });
}

const todayLabel = (() => {
  const d = new Date();
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getMonth() + 1}/${String(d.getDate()).padStart(2, '0')} (${dayNames[d.getDay()]})`;
})();

interface Props {
  childId: string;
  childName?: string;
  weeklyRecords?: DailyRecord[];
}

const DailyList = ({ childId, childName, weeklyRecords }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [roomMap, setRoomMap] = useState<Record<string, number>>({});

  useEffect(() => {
    const userId = authStore.getUserId();
    if (!userId) return;
    getChatRooms(userId)
      .then((data) => {
        const group = (data.result?.childChatGroups ?? []).find(
          (g) => String(g.childId) === childId
        );
        if (!group) return;
        const map: Record<string, number> = {};
        for (const room of group.chatRooms) {
          map[room.date.slice(0, 10)] = room.roomId;
        }
        setRoomMap(map);
      })
      .catch(() => {});
  }, [childId]);

  // dashboard weeklyRecords가 있으면 그걸 쓰고, 없으면 이번 주 날짜 생성
  const weekDates = weeklyRecords
    ? weeklyRecords.map((r) => ({
        dayLabel: DAY_OF_WEEK_MAP[r.dayOfWeek] ?? r.dayOfWeek,
        dateLabel: parseDateLabel(r.date),
        isoDate: r.date?.slice(0, 10) ?? '',
        isExist: r.isExist,
        content: r.content,
      }))
    : getThisWeekDates().map((d) => ({ ...d, isExist: false, content: '' }));

  return (
    <Box sx={{ px: 2, pb: 3 }}>
      <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ display: 'block', mb: 1.5, px: 0.5 }}>
        {todayLabel}
      </Typography>
      {weekDates.map((day, i) => {
        const roomId = roomMap[day.isoDate];
        const hasRecord = day.isExist || roomId !== undefined;
        return (
          <Box key={day.isoDate}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', py: 1.75, gap: 1.5 }}>
              <Box sx={{ textAlign: 'center', minWidth: 36, flexShrink: 0 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>{day.dayLabel}</Typography>
                <Typography variant="body2" fontWeight={600}>{day.dateLabel}</Typography>
              </Box>
              {hasRecord ? (
                <Box
                  onClick={() => navigate(`/child/${childId}`, { state: { childName, roomId } })}
                  sx={{ flex: 1, p: 1.5, borderRadius: 2, backgroundColor: '#1A1A1A', display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:active': { backgroundColor: '#333' } }}
                >
                  <ChatBubbleIcon sx={{ fontSize: 14, color: '#fff', flexShrink: 0 }} />
                  <Typography variant="caption" sx={{ lineHeight: 1.6, color: '#fff', fontWeight: 500 }} noWrap>
                    {day.content || t('records.hasRecord', '기록이 있어요')}
                  </Typography>
                </Box>
              ) : (
                <Box
                  onClick={() => navigate(`/child/${childId}`, { state: { childName } })}
                  sx={{ flex: 1, p: 1.5, borderRadius: 2, backgroundColor: '#F5F5F5', display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', '&:active': { backgroundColor: '#EBEBEB' } }}
                >
                  <ChatBubbleOutlineIcon sx={{ fontSize: 14, color: '#BDBDBD', flexShrink: 0 }} />
                  <Typography variant="caption" sx={{ lineHeight: 1.6, color: '#BDBDBD' }}>{t('records.noRecord')}</Typography>
                </Box>
              )}
            </Box>
            {i < weekDates.length - 1 && <Divider sx={{ borderColor: '#F5F5F5' }} />}
          </Box>
        );
      })}
    </Box>
  );
};

export default DailyList;
